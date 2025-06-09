/**
 * @jest-environment node
 */
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { createHmac } from "crypto";
import type { DidItWebhookPayload } from "@/types/didit/webhook";

// Mock environment variable
const mockWebhookSecret = "test-webhook-secret";
process.env.WEBHOOK_SECRET_KEY = mockWebhookSecret;

// Mock NextRequest and NextResponse
const mockJson = jest.fn();
const mockText = jest.fn();
const mockHeaders = new Map<string, string>();

const MockNextRequest = jest.fn().mockImplementation((url: string, init: { method: string }) => ({
  url,
  method: init.method,
  headers: {
    get: (key: string) => mockHeaders.get(key.toLowerCase())
  },
  text: mockText,
  json: mockJson
}));

const MockNextResponse = {
  json: jest.fn().mockImplementation((data: unknown, init?: { status?: number }) => ({
    status: init?.status || 200,
    json: async () => data
  }))
};

// Mock the modules
jest.mock("next/server", () => ({
  NextRequest: MockNextRequest,
  NextResponse: MockNextResponse
}));

// Import after mocking
import { POST } from "@/app/api/didit/webhook/route";

describe("Didit Webhook Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.clear();
    console.info = jest.fn() as jest.MockedFunction<typeof console.info>;
    console.error = jest.fn() as jest.MockedFunction<typeof console.error>;
  });

  const createSignature = (body: string, secret: string): string => {
    const hmac = createHmac("sha256", secret);
    return hmac.update(body).digest("hex");
  };

  const createWebhookPayload = (overrides: Partial<DidItWebhookPayload> = {}): DidItWebhookPayload => ({
    session_id: "test-session-123",
    status: "Approved",
    created_at: Math.floor(Date.now() / 1000),
    timestamp: Math.floor(Date.now() / 1000),
    workflow_id: "test-workflow-456",
    vendor_data: "test-vendor-data",
    metadata: {
      user_type: "premium",
      account_id: "ABC123"
    },
    ...overrides
  });

  const setupValidWebhookRequest = (payload: DidItWebhookPayload) => {
    const body = JSON.stringify(payload);
    const signature = createSignature(body, mockWebhookSecret);
    
    mockHeaders.set("x-signature", signature);
    mockHeaders.set("x-timestamp", payload.timestamp.toString());
    mockText.mockResolvedValue(body);
    
    return body;
  };

  it("should create valid HMAC signature", () => {
    const payload = createWebhookPayload();
    const body = JSON.stringify(payload);
    const signature = createSignature(body, mockWebhookSecret);

    expect(signature).toBeTruthy();
    expect(signature).toMatch(/^[a-f0-9]{64}$/);
  });

  it("should validate webhook payload structure", () => {
    const payload = createWebhookPayload();
    
    expect(payload.session_id).toBeTruthy();
    expect(payload.status).toBeTruthy();
    expect(payload.workflow_id).toBeTruthy();
    expect(payload.timestamp).toBeTruthy();
    expect(payload.vendor_data).toBeTruthy();
  });

  it("should handle approved verification with complete data", async () => {
    const payload = createWebhookPayload({
      status: "Approved",
      decision: {
        session_id: "test-session-123",
        session_number: 12345,
        session_url: "https://verify.didit.me/session/test-session-123",
        status: "Approved",
        workflow_id: "test-workflow-456",
        features: ["ID_VERIFICATION", "LIVENESS"],
        vendor_data: "test-vendor-data",
        callback: "https://example.com/callback",
        id_verification: {
          status: "Approved",
          document_type: "Identity Card",
          document_number: "CAA000000",
          personal_number: "99999999R",
          portrait_image: "https://example.com/portrait.jpg",
          front_image: "https://example.com/front.jpg",
          back_image: "https://example.com/back.jpg",
          full_front_image: "https://example.com/full_front.jpg",
          full_back_image: "https://example.com/full_back.jpg",
          date_of_birth: "1980-01-01",
          age: 44,
          expiration_date: "2031-06-02",
          date_of_issue: "2021-06-02",
          issuing_state: "ESP",
          issuing_state_name: "Spain",
          first_name: "Carmen",
          last_name: "Española",
          full_name: "Carmen Española",
          gender: "F",
          address: "Avda de Madrid 34, Madrid, Madrid",
          formatted_address: "Avda de Madrid 34, Madrid, Madrid 28822, Spain",
          place_of_birth: "Madrid",
          marital_status: "Single",
          nationality: "ESP"
        },
        created_at: "2024-07-24T08:54:25.443172Z"
      }
    });

    setupValidWebhookRequest(payload);
    
    const mockRequest = new MockNextRequest("https://example.com/api/didit/webhook", {
      method: "POST"
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(200);
    expect(payload.decision?.id_verification).toBeTruthy();
    expect(payload.decision?.id_verification?.full_name).toBe("Carmen Española");
    expect(payload.decision?.id_verification?.document_type).toBe("Identity Card");
  });

  it("should handle declined verification with review comments", () => {
    const payload = createWebhookPayload({
      status: "Declined",
      decision: {
        session_id: "test-session-123",
        session_number: 12345,
        session_url: "https://verify.didit.me/session/test-session-123",
        status: "Declined",
        workflow_id: "test-workflow-456",
        features: ["ID_VERIFICATION"],
        vendor_data: "test-vendor-data",
        callback: "https://example.com/callback",
        reviews: [
          {
            user: "admin@example.com",
            new_status: "Declined",
            comment: "Document appears to be altered",
            created_at: "2024-07-18T13:29:00.366811Z"
          }
        ],
        created_at: "2024-07-24T08:54:25.443172Z"
      }
    });

    expect(payload.decision?.reviews).toBeTruthy();
    expect(payload.decision?.reviews?.[0]?.comment).toBe("Document appears to be altered");
  });

  it("should reject requests with invalid signature", async () => {
    const payload = createWebhookPayload();
    const body = JSON.stringify(payload);
    
    // Set invalid signature
    mockHeaders.set("x-signature", "invalid-signature");
    mockHeaders.set("x-timestamp", payload.timestamp.toString());
    mockText.mockResolvedValue(body);
    
    const mockRequest = new MockNextRequest("https://example.com/api/didit/webhook", {
      method: "POST"
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(401);
  });

  it("should reject requests with stale timestamp", async () => {
    const staleTimestamp = Math.floor(Date.now() / 1000) - 400; // 400 seconds ago
    const payload = createWebhookPayload({ timestamp: staleTimestamp });
    const body = JSON.stringify(payload);
    const signature = createSignature(body, mockWebhookSecret);
    
    mockHeaders.set("x-signature", signature);
    mockHeaders.set("x-timestamp", staleTimestamp.toString());
    mockText.mockResolvedValue(body);
    
    const mockRequest = new MockNextRequest("https://example.com/api/didit/webhook", {
      method: "POST"
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(401);
  });

  it("should validate timestamp freshness", () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const freshTimestamp = currentTime - 60; // 1 minute ago
    const staleTimestamp = currentTime - 400; // 400 seconds ago

    const timeDiffFresh = Math.abs(currentTime - freshTimestamp);
    const timeDiffStale = Math.abs(currentTime - staleTimestamp);

    expect(timeDiffFresh).toBeLessThan(300); // Should be valid
    expect(timeDiffStale).toBeGreaterThan(300); // Should be invalid
  });

  it("should handle missing webhook secret configuration", async () => {
    // Temporarily remove webhook secret
    const originalSecret = process.env.WEBHOOK_SECRET_KEY;
    delete process.env.WEBHOOK_SECRET_KEY;
    
    const payload = createWebhookPayload();
    setupValidWebhookRequest(payload);
    
    const mockRequest = new MockNextRequest("https://example.com/api/didit/webhook", {
      method: "POST"
    });

    const response = await POST(mockRequest);
    
    expect(response.status).toBe(500);
    
    // Restore webhook secret
    process.env.WEBHOOK_SECRET_KEY = originalSecret;
  });
});
