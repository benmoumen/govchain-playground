/**
 * Custom error classes for Didit webhook processing
 */

export class DidItWebhookError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "DidItWebhookError";
  }
}

export class DidItSignatureError extends DidItWebhookError {
  constructor(message: string = "Invalid webhook signature") {
    super(message, "INVALID_SIGNATURE", 401);
    this.name = "DidItSignatureError";
  }
}

export class DidItTimestampError extends DidItWebhookError {
  constructor(message: string = "Request timestamp is stale") {
    super(message, "STALE_TIMESTAMP", 401);
    this.name = "DidItTimestampError";
  }
}

export class DidItPayloadError extends DidItWebhookError {
  constructor(message: string = "Invalid webhook payload") {
    super(message, "INVALID_PAYLOAD", 400);
    this.name = "DidItPayloadError";
  }
}

export class DidItProcessingError extends DidItWebhookError {
  constructor(message: string = "Error processing verification data") {
    super(message, "PROCESSING_ERROR", 500);
    this.name = "DidItProcessingError";
  }
}

/**
 * Utility functions for webhook error handling
 */
export class DidItWebhookErrorHandler {
  
  /**
   * Log webhook error with context
   */
  static logError(error: Error, context: Record<string, unknown> = {}) {
    console.error("Didit webhook error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    });
  }

  /**
   * Handle and format error response
   */
  static formatErrorResponse(error: Error) {
    if (error instanceof DidItWebhookError) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode
      };
    }

    // Generic error
    return {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      statusCode: 500
    };
  }

  /**
   * Validate webhook headers
   */
  static validateHeaders(signature?: string | null, timestamp?: string | null) {
    if (!signature) {
      throw new DidItSignatureError("Missing X-Signature header");
    }

    if (!timestamp) {
      throw new DidItTimestampError("Missing X-Timestamp header");
    }

    const timestampNum = parseInt(timestamp, 10);
    if (isNaN(timestampNum)) {
      throw new DidItTimestampError("Invalid timestamp format");
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = Math.abs(currentTime - timestampNum);
    
    if (timeDiff > 300) { // 5 minutes
      throw new DidItTimestampError(
        `Request timestamp is too old: ${timeDiff} seconds`
      );
    }
  }

  /**
   * Validate webhook payload structure
   */
  static validatePayload(payload: unknown): asserts payload is Record<string, unknown> {
    if (!payload || typeof payload !== "object") {
      throw new DidItPayloadError("Payload must be an object");
    }

    const requiredFields = ["session_id", "status", "workflow_id", "timestamp"];
    const payloadObj = payload as Record<string, unknown>;

    for (const field of requiredFields) {
      if (!(field in payloadObj) || !payloadObj[field]) {
        throw new DidItPayloadError(`Missing required field: ${field}`);
      }
    }

    // Validate status
    const validStatuses = [
      "Not Started",
      "In Progress", 
      "Approved",
      "Declined",
      "In Review",
      "Abandoned"
    ];

    if (!validStatuses.includes(payloadObj.status as string)) {
      throw new DidItPayloadError(`Invalid status: ${payloadObj.status}`);
    }
  }
}
