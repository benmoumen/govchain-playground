/**
 * Minimal KYC Session Service following YAGNI principles
 * Only implements core functionality as per Didit API flow
 * Enhanced with Didit API fallback for resilience
 */

import { DIDIT_CONFIG } from "@/config/didit/config";
import { DiditSDK } from "@/lib/didit/sdk";
import type { KYCSession, UserKYCData } from "@/types/didit/session";
import { v4 as uuidv4 } from "uuid";

// Simple in-memory storage for sessions
const sessions = new Map<string, KYCSession>();

// Initialize SDK
const diditSDK = new DiditSDK({
  apiKey: DIDIT_CONFIG.API_KEY!,
  workflowId: DIDIT_CONFIG.WORKFLOW_ID!,
  webhookSecret: DIDIT_CONFIG.WEBHOOK_SECRET,
});

export class KYCService {
  /**
   * Create new verification session
   */
  static async createSession(userData: UserKYCData): Promise<KYCSession> {
    const sessionId = uuidv4();

    // Create local session
    const session: KYCSession = {
      id: sessionId,
      userData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sessions.set(sessionId, session);

    try {
      // Create Didit session
      const diditSession = await diditSDK.createSession(
        userData,
        sessionId,
        DIDIT_CONFIG.CALLBACK_URL
      );

      // Update local session with Didit data
      session.sessionId = diditSession.session_id;
      session.sessionToken = diditSession.session_token;
      session.verificationUrl = diditSession.url;
      session.status = "created";
      session.updatedAt = new Date();

      sessions.set(sessionId, session);

      return session;
    } catch (error) {
      session.status = "error";
      session.error = error instanceof Error ? error.message : "Unknown error";
      session.updatedAt = new Date();
      sessions.set(sessionId, session);
      throw error;
    }
  }

  /**
   * Get session by ID (with Didit API fallback for resilience)
   */
  static async getSession(sessionId: string): Promise<KYCSession | null> {
    // Try memory first
    const memorySession = sessions.get(sessionId);
    if (memorySession) {
      return memorySession;
    }

    // Fallback to Didit API (for sessions not in memory due to server restart)
    try {
      console.log(`🔄 Session ${sessionId} not in memory, trying Didit API...`);
      const diditData = await this.getSessionStatus(sessionId);
      
      // Create a minimal session from Didit data
      const session: KYCSession = {
        id: sessionId,
        userData: {
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
        },
        status: this.mapDiditStatusToSimple(diditData.status as string),
        createdAt: new Date(),
        updatedAt: new Date(),
        sessionId: sessionId,
        diditData: diditData,
      };
      
      // Cache in memory for next time
      sessions.set(sessionId, session);
      console.log(`✅ Retrieved session ${sessionId} from Didit API`);
      return session;
    } catch {
      console.log(`❌ Session ${sessionId} not found in memory or Didit API`);
      return null;
    }
  }

  /**
   * Update session status from webhook
   */
  static updateSessionStatus(
    sessionId: string,
    status: string,
    diditData?: Record<string, unknown>
  ): void {
    const session = sessions.get(sessionId);
    if (session) {
      // Map Didit status to our simplified status
      const mappedStatus = mapDiditStatus(status);
      session.status = mappedStatus;
      session.updatedAt = new Date();
      if (diditData) {
        session.diditData = diditData;
      }
      sessions.set(sessionId, session);
    }
  }

  /**
   * Find session by Didit session ID
   */
  static findByDiditId(diditSessionId: string): KYCSession | undefined {
    for (const [, session] of sessions) {
      if (session.sessionId === diditSessionId) {
        return session;
      }
    }
    return undefined;
  }

  /**
   * Get session decision from Didit API
   */
  static async getSessionDecision(
    sessionId: string
  ): Promise<Record<string, unknown>> {
    return diditSDK.getSessionDecision(sessionId) as unknown as Record<
      string,
      unknown
    >;
  }

  /**
   * Get session status from Didit API (for any session)
   */
  static async getSessionStatus(
    sessionId: string
  ): Promise<Record<string, unknown>> {
    return diditSDK.getSessionStatus(sessionId) as unknown as Record<
      string,
      unknown
    >;
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhook(payload: string, signature: string): boolean {
    return diditSDK.verifyWebhookSignature(payload, signature);
  }

  /**
   * Get all sessions (for debugging)
   */
  static getAllSessions(): KYCSession[] {
    return Array.from(sessions.values());
  }

  /**
   * Map Didit status to our simplified status enum
   */
  private static mapDiditStatusToSimple(diditStatus: string): KYCSession["status"] {
    const status = diditStatus.toLowerCase();

    if (
      status.includes("complete") ||
      status.includes("success") ||
      status.includes("approve")
    ) {
      return "completed";
    }
    if (status.includes("progress") || status.includes("processing")) {
      return "in_progress";
    }
    if (
      status.includes("fail") ||
      status.includes("reject") ||
      status.includes("error")
    ) {
      return "failed";
    }
    if (status.includes("pending") || status.includes("waiting")) {
      return "pending";
    }

    // Default to in_progress for unknown statuses
    return "in_progress";
  }
}

/**
 * Map Didit status to our simplified status enum
 */
function mapDiditStatus(diditStatus: string): KYCSession["status"] {
  const status = diditStatus.toLowerCase();

  if (
    status.includes("complete") ||
    status.includes("success") ||
    status.includes("approve")
  ) {
    return "completed";
  }
  if (status.includes("progress") || status.includes("processing")) {
    return "in_progress";
  }
  if (
    status.includes("fail") ||
    status.includes("reject") ||
    status.includes("error")
  ) {
    return "failed";
  }
  if (status.includes("pending") || status.includes("waiting")) {
    return "pending";
  }

  // Default to in_progress for unknown statuses
  return "in_progress";
}
