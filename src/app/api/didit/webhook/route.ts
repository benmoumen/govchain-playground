import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import type { DidItWebhookPayload, DidItWebhookResponse, DidItDecision } from "@/types/didit/webhook";

/**
 * Didit Identity Verification Webhook Endpoint
 * 
 * Receives webhook notifications from Didit when verification status changes.
 * Implements signature verification as per Didit documentation.
 * 
 * @see https://docs.didit.me/reference/webhooks
 */
export async function POST(request: NextRequest): Promise<NextResponse<DidItWebhookResponse | { message: string }>> {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY;
    if (!webhookSecret) {
      console.error("WEBHOOK_SECRET_KEY environment variable is not set");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Extract headers
    const signature = request.headers.get("X-Signature");
    const timestamp = request.headers.get("X-Timestamp");

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Validate required data
    if (!signature || !timestamp || !rawBody) {
      console.error("Missing required headers or body", { signature: !!signature, timestamp: !!timestamp, body: !!rawBody });
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate timestamp (within 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const incomingTime = parseInt(timestamp, 10);
    
    if (isNaN(incomingTime) || Math.abs(currentTime - incomingTime) > 300) {
      console.error("Request timestamp is stale", { currentTime, incomingTime, diff: Math.abs(currentTime - incomingTime) });
      return NextResponse.json(
        { message: "Request timestamp is stale" },
        { status: 401 }
      );
    }

    // Generate HMAC signature
    const hmac = createHmac("sha256", webhookSecret);
    const expectedSignature = hmac.update(rawBody).digest("hex");

    // Compare signatures using timing-safe comparison
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const providedBuffer = Buffer.from(signature, "utf8");

    if (
      expectedBuffer.length !== providedBuffer.length ||
      !timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      console.error("Invalid signature", { 
        expected: expectedSignature, 
        provided: signature,
        rawBodyLength: rawBody.length 
      });
      return NextResponse.json(
        { message: `Invalid signature. Computed (${expectedSignature}), Provided (${signature})` },
        { status: 401 }
      );
    }

    // Parse and validate JSON payload
    let payload: DidItWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as DidItWebhookPayload;
    } catch (parseError) {
      console.error("Invalid JSON payload", parseError);
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Log the webhook event
    console.info("Didit webhook received", {
      session_id: payload.session_id,
      status: payload.status,
      workflow_id: payload.workflow_id,
      vendor_data: payload.vendor_data,
      timestamp: payload.timestamp,
      has_decision: !!payload.decision
    });

    // Process the webhook based on status
    await processVerificationWebhook(payload);

    return NextResponse.json(
      { message: "Webhook event dispatched" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error processing Didit webhook:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Process the verification webhook based on the status
 */
async function processVerificationWebhook(payload: DidItWebhookPayload): Promise<void> {
  const { session_id, status, decision, vendor_data, workflow_id } = payload;

  switch (status) {
    case "Not Started":
      console.info(`Verification session ${session_id} started`);
      // Handle session start - could update database or trigger notifications
      break;

    case "In Progress":
      console.info(`Verification session ${session_id} in progress`);
      // Handle progress update
      break;

    case "Approved":
      console.info(`Verification session ${session_id} approved`);
      if (decision?.id_verification) {
        console.info("ID verification data available", {
          document_type: decision.id_verification.document_type,
          full_name: decision.id_verification.full_name,
          date_of_birth: decision.id_verification.date_of_birth
        });
      }
      // Handle successful verification - could create user account, grant access, etc.
      await handleApprovedVerification(session_id, decision, vendor_data, workflow_id);
      break;

    case "Declined":
      console.info(`Verification session ${session_id} declined`);
      if (decision?.reviews) {
        console.info("Decline reasons", decision.reviews);
      }
      // Handle declined verification
      await handleDeclinedVerification(session_id, decision, vendor_data, workflow_id);
      break;

    case "In Review":
      console.info(`Verification session ${session_id} under manual review`);
      // Handle manual review status
      break;

    case "Abandoned":
      console.info(`Verification session ${session_id} abandoned by user`);
      // Handle abandoned session
      break;

    default:
      console.warn(`Unknown verification status: ${status}`);
  }
}

/**
 * Handle approved verification
 */
async function handleApprovedVerification(
  sessionId: string,
  decision: DidItDecision | undefined,
  vendorData: string,
  workflowId: string
): Promise<void> {
  // TODO: Implement your business logic for approved verification
  // Examples:
  // - Create user account with verified identity
  // - Grant access to protected resources
  // - Issue digital credentials
  // - Update user verification status in database
  
  console.info("Processing approved verification", {
    sessionId,
    vendorData,
    workflowId,
    hasIdVerification: !!decision?.id_verification
  });
  
  // Example: Store verification data in database
  // await storeVerificationData(sessionId, decision, vendorData);
  
  // Example: Send confirmation email
  // await sendVerificationConfirmation(vendorData, decision);
  
  // Example: Create verifiable credential
  // await issueVerificationCredential(decision?.id_verification);
}

/**
 * Handle declined verification
 */
async function handleDeclinedVerification(
  sessionId: string,
  decision: DidItDecision | undefined,
  vendorData: string,
  workflowId: string
): Promise<void> {
  // TODO: Implement your business logic for declined verification
  // Examples:
  // - Notify user of decline
  // - Log decline reason
  // - Offer retry or appeal process
  
  console.info("Processing declined verification", {
    sessionId,
    vendorData,
    workflowId,
    reviews: decision?.reviews
  });
  
  // Example: Send decline notification
  // await sendDeclineNotification(vendorData, decision?.reviews);
  
  // Example: Log for audit
  // await logVerificationDecline(sessionId, decision?.reviews);
}
