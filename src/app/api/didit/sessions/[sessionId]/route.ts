/**
 * Minimal session status endpoint
 * Returns session status with optional API fallback
 */

import { KYCService } from "@/services/didit/session-service";
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

    console.log(`🔍 Looking for session: ${sessionId}`);

    // Get session (memory first, then Didit API fallback)
    const session = await KYCService.getSession(sessionId);

    // Debug: Log all existing session IDs in memory
    const allSessions = KYCService.getAllSessions();
    console.log(`📋 Available sessions in memory: ${allSessions.length}`);
    allSessions.forEach((s) =>
      console.log(`  - ${s.id} (status: ${s.status})`)
    );

    if (!session) {
      console.log(`❌ Session ${sessionId} not found in memory or Didit API`);
      return NextResponse.json(
        { error: "Session not found in local storage or Didit API" },
        { status: 404 }
      );
    }

    const source = allSessions.find(s => s.id === sessionId) ? 'local_storage' : 'didit_api';
    console.log(`✅ Found session: ${session.id} (status: ${session.status}) from ${source}`);

    // If session is completed, optionally fetch latest decision from Didit API
    if (session.status === "completed" && session.sessionId) {
      try {
        const decision = await KYCService.getSessionDecision(
          session.sessionId
        );
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
      source, // Indicate data source (local_storage or didit_api)
    });
  } catch (error) {
    console.error("Session status error:", error);
    return NextResponse.json(
      { error: "Failed to get session status" },
      { status: 500 }
    );
  }
}
