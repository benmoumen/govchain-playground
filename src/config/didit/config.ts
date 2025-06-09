/**
 * Simplified Didit Session Configuration
 * Following minimal API flow requirements
 */

export const DIDIT_CONFIG = {
  API_BASE_URL: "https://verification.didit.me",

  // Webhook endpoint for receiving status updates
  WEBHOOK_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/didit/webhook`,

  // Callback URL where users return after verification
  CALLBACK_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/playground/kyc/results`,

  // Required environment variables
  API_KEY: process.env.DIDIT_API_KEY,
  WORKFLOW_ID: process.env.DIDIT_WORKFLOW_ID,
  WEBHOOK_SECRET: process.env.DIDIT_WEBHOOK_SECRET_KEY,
} as const;
