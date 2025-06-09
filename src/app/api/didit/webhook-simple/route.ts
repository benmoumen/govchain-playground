/**
 * Minimal webhook handler following official Didit documentation
 * Step 5: Handle webhook notifications for verification status
 */

import { SimpleKYCService } from "@/services/didit/simple-session-service";
import type { DidItWebhookPayload } from "@/types/didit/webhook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!SimpleKYCService.verifyWebhook(body, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const payload: DidItWebhookPayload = JSON.parse(body);
    
    // Find session by vendor_data (our internal session ID)
    const session = SimpleKYCService.getSession(payload.vendor_data);
    
    if (session) {
      // Update session status
      SimpleKYCService.updateSessionStatus(
        payload.vendor_data,
        payload.status,
        payload as unknown as Record<string, unknown>
      );
      
      console.log(`✅ Updated session ${payload.vendor_data} to status: ${payload.status}`);
    } else {
      console.log(`⚠️ Session not found for vendor_data: ${payload.vendor_data}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
