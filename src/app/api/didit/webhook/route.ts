/**
 * Minimal webhook handler following official Didit documentation
 * Step 5: Handle webhook notifications for verification status
 */

import { SimpleKYCService } from "@/services/didit/session-service";
import type { DiditWebhookPayload } from "@/types/didit/webhook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature");
    const timestamp = request.headers.get("x-timestamp");

    console.log(`🔔 Webhook received for session: ${JSON.parse(body).session_id}`);
    console.log(`📝 Webhook payload:`, JSON.parse(body));
    console.log(`🔐 Signature: ${signature}`);
    console.log(`⏰ Timestamp: ${timestamp}`);

    if (!signature) {
      console.log("❌ Missing webhook signature");
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    try {
      if (!SimpleKYCService.verifyWebhook(body, signature)) {
        console.log("❌ Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
      console.log("✅ Webhook signature verified");
    } catch (verifyError) {
      console.log("❌ Webhook signature verification failed:", verifyError);
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 401 }
      );
    }

    const payload: DiditWebhookPayload = JSON.parse(body);

    // Debug: Log all available sessions
    const allSessions = SimpleKYCService.getAllSessions();
    console.log(`📋 Available sessions: ${allSessions.length}`);
    allSessions.forEach(s => console.log(`  - ${s.id} (vendor_data in session: ${s.id})`));

    // Find session by vendor_data (our internal session ID)
    const session = SimpleKYCService.getSession(payload.vendor_data);

    if (session) {
      // Update session status
      SimpleKYCService.updateSessionStatus(
        payload.vendor_data,
        payload.status,
        payload as unknown as Record<string, unknown>
      );

      console.log(
        `✅ Updated session ${payload.vendor_data} to status: ${payload.status}`
      );
    } else {
      console.log(
        `⚠️ Session not found for vendor_data: ${payload.vendor_data}`
      );
      
      // Also try to find by Didit session ID
      const sessionByDiditId = SimpleKYCService.findByDiditId(payload.session_id);
      if (sessionByDiditId) {
        console.log(`✅ Found session by Didit ID: ${sessionByDiditId.id}`);
        SimpleKYCService.updateSessionStatus(
          sessionByDiditId.id,
          payload.status,
          payload as unknown as Record<string, unknown>
        );
      } else {
        console.log(`⚠️ Session not found by Didit ID either: ${payload.session_id}`);
        // For debugging: Log what we tried to find
        console.log(`🔍 Searched for vendor_data: "${payload.vendor_data}"`);
        console.log(`🔍 Searched for didit session_id: "${payload.session_id}"`);
      }
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
