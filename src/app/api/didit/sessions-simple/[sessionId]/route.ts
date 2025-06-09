/**
 * Minimal session status endpoint
 * Returns session status with optional API fallback
 */

import { SimpleKYCService } from "@/services/didit/simple-session-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
): Promise<NextResponse> {
  try {
    const { sessionId } = await context.params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get local session
    const session = SimpleKYCService.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // If session is completed, optionally fetch latest decision from Didit API
    if (session.status === "completed" && session.sessionId) {
      try {
        const decision = await SimpleKYCService.getSessionDecision(session.sessionId);
        session.diditData = decision;
      } catch (error) {
        console.warn("Failed to fetch decision from Didit API:", error);
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        verificationUrl: session.verificationUrl,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        userData: session.userData,
        diditData: session.diditData,
        error: session.error,
      },
    });
  } catch (error) {
    console.error("Session status error:", error);
    return NextResponse.json(
      { error: "Failed to get session status" },
      { status: 500 }
    );
  }
}
