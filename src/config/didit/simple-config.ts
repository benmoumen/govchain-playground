/**
 * Simplified Didit Session Configuration
 * Following minimal API flow requirements
 */

export const SIMPLE_DIDIT_CONFIG = {
  API_BASE_URL: "https://verification.didit.me",
  
  // Webhook endpoint for receiving status updates
  WEBHOOK_URL: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/didit/webhook-simple`
    : "http://localhost:3000/api/didit/webhook-simple",
    
  // Callback URL where users return after verification
  CALLBACK_URL: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/playground/kyc/verification-simple/results`
    : "http://localhost:3000/playground/kyc/verification-simple/results",
    
  // Required environment variables
  API_KEY: process.env.DIDIT_API_KEY,
  WORKFLOW_ID: process.env.DIDIT_WORKFLOW_ID,
  WEBHOOK_SECRET: process.env.DIDIT_WEBHOOK_SECRET,
} as const;
