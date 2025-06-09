/**
 * Minimal Didit KYC SDK following official API documentation
 * Implements only the essential features as per API full flow:
 * https://docs.didit.me/reference/api-full-flow
 */

import type {
  DidItSessionRequest,
  DidItSessionResponse,
  UserKYCData,
} from "@/types/didit/session";
import { createHmac } from "crypto";

export interface DiditConfig {
  apiKey: string;
  workflowId: string;
  webhookSecret?: string;
  baseUrl?: string;
}

export interface SessionDecision {
  session_id: string;
  status: string;
  workflow_id: string;
  vendor_data: string;
  metadata?: unknown;
  decision?: {
    status: string;
    features: string[];
  };
}

export class DiditSDK {
  private config: Required<DiditConfig>;

  constructor(config: DiditConfig) {
    this.config = {
      baseUrl: "https://verification.didit.me",
      webhookSecret: "",
      ...config,
    };

    if (!this.config.apiKey || !this.config.workflowId) {
      throw new Error("API key and workflow ID are required");
    }
  }

  /**
   * Step 3: Create verification session
   */
  async createSession(
    userData: UserKYCData,
    vendorData?: string,
    callback?: string
  ): Promise<DidItSessionResponse> {
    const sessionRequest: DidItSessionRequest = {
      workflow_id: this.config.workflowId,
      vendor_data: vendorData || `user-${Date.now()}`,
      callback,
      contact_details: {
        email: userData.email,
        phone_number: userData.phoneNumber,
      },
      expected_details: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        date_of_birth: userData.dateOfBirth,
        country: userData.country || "USA",
      },
    };

    const response = await fetch(`${this.config.baseUrl}/v2/session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": this.config.apiKey,
      },
      body: JSON.stringify(sessionRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Didit API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Step 6: Retrieve session decision (optional)
   */
  async getSessionDecision(sessionId: string): Promise<SessionDecision> {
    const response = await fetch(
      `${this.config.baseUrl}/v2/session/${sessionId}/decision/`,
      {
        headers: {
          "X-Api-Key": this.config.apiKey,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Didit API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get general session status from Didit API
   * This can be used to query any session, not just completed ones
   */
  async getSessionStatus(sessionId: string): Promise<{
    session_id: string;
    status: string;
    workflow_id: string;
    vendor_data?: string;
    metadata?: unknown;
  }> {
    const response = await fetch(
      `${this.config.baseUrl}/v2/session/${sessionId}/`,
      {
        headers: {
          "X-Api-Key": this.config.apiKey,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Didit API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Step 5: Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      throw new Error("Webhook secret is required for verification");
    }

    const expectedSignature = createHmac("sha256", this.config.webhookSecret)
      .update(payload)
      .digest("hex");

    const cleanSignature = signature.startsWith("sha256=")
      ? signature.slice(7)
      : signature;

    return expectedSignature === cleanSignature;
  }
}
