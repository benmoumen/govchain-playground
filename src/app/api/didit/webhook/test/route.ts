import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

interface TestWebhookRequest {
  payload: Record<string, unknown>;
}

interface TestWebhookResponse {
  success: boolean;
  signature: string;
  timestamp: number;
  updatedPayload: Record<string, unknown>;
}

/**
 * Test endpoint to generate HMAC signature for webhook testing
 * This endpoint is only for development/testing purposes
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: TestWebhookRequest = await request.json();
    
    if (!body.payload) {
      return NextResponse.json(
        { success: false, error: "Payload is required" },
        { status: 400 }
      );
    }

    // Generate timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Update payload with current timestamp
    const updatedPayload = {
      ...body.payload,
      timestamp,
      created_at: timestamp,
    };

    // Convert payload to string for signing
    const payloadString = JSON.stringify(updatedPayload);
    
    // Generate HMAC signature
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY;
    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const signature = createHmac("sha256", webhookSecret)
      .update(payloadString)
      .digest("hex");

    const response: TestWebhookResponse = {
      success: true,
      signature,
      timestamp,
      updatedPayload,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating webhook signature:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
