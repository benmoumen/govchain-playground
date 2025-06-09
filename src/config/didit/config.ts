/**
 * Didit Identity Verification Configuration
 */

export const DidItConfig = {
  // Webhook configuration
  webhook: {
    // Maximum allowed time difference in seconds (5 minutes)
    maxTimeDifference: 300,
    
    // Required headers
    signatureHeader: "X-Signature",
    timestampHeader: "X-Timestamp",
    
    // HMAC algorithm
    hmacAlgorithm: "sha256" as const,
  },

  // Verification statuses
  statuses: {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress", 
    APPROVED: "Approved",
    DECLINED: "Declined",
    IN_REVIEW: "In Review",
    ABANDONED: "Abandoned"
  } as const,

  // Critical warning types that require attention
  criticalWarnings: [
    "DOCUMENT_EXPIRED",
    "DOCUMENT_FAKE", 
    "FACE_MISMATCH",
    "LIVENESS_FAILED"
  ] as const,

  // Features that can be included in verification
  features: [
    "ID_VERIFICATION",
    "NFC",
    "LIVENESS", 
    "FACE_MATCH",
    "POA", // Proof of Address
    "PHONE",
    "AML", // Anti-Money Laundering
    "IP_ANALYSIS"
  ] as const,

  // Environment configuration
  env: {
    webhookSecretKey: "WEBHOOK_SECRET_KEY"
  }
} as const;

export type DidItStatus = typeof DidItConfig.statuses[keyof typeof DidItConfig.statuses];
export type DidItFeature = typeof DidItConfig.features[number];
export type DidItWarningType = typeof DidItConfig.criticalWarnings[number];
