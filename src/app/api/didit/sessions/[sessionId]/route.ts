/**
 * Minimal session status endpoint
 * Returns session status with optional API fallback
 */

import { SimpleKYCService } from "@/services/didit/session-service";
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

    // Get local session
    const session = SimpleKYCService.getSession(sessionId);

    // Debug: Log all existing session IDs
    const allSessions = SimpleKYCService.getAllSessions();
    console.log(`📋 Available sessions: ${allSessions.length}`);
    allSessions.forEach((s) =>
      console.log(`  - ${s.id} (status: ${s.status})`)
    );

    if (!session) {
      console.log(`❌ Session ${sessionId} not found locally`);
      
      // Fallback: Try to query Didit API directly using the sessionId as Didit session ID
      console.log(`🔄 Attempting to fetch session data from Didit API...`);
      try {
        const diditData = await SimpleKYCService.getSessionStatus(sessionId);
        console.log(`✅ Found session in Didit API: ${sessionId}`);
        
        // Map Didit status to our simplified status
        const mapDiditStatus = (status: unknown): string => {
          if (typeof status !== 'string') return 'unknown';
          const statusLower = status.toLowerCase();
          
          if (statusLower.includes('complete') || statusLower.includes('success') || statusLower.includes('approve')) {
            return 'completed';
          }
          if (statusLower.includes('progress') || statusLower.includes('processing')) {
            return 'in_progress';
          }
          if (statusLower.includes('fail') || statusLower.includes('reject') || statusLower.includes('error')) {
            return 'failed';
          }
          if (statusLower.includes('pending') || statusLower.includes('waiting')) {
            return 'pending';
          }
          
          return 'unknown';
        };
        
        // Return the Didit data wrapped in our response format
        return NextResponse.json({
          success: true,
          session: {
            id: sessionId,
            status: mapDiditStatus(diditData.status),
            diditData,
            // Note: Local session data not available
            verificationUrl: null,
            createdAt: null,
            updatedAt: new Date(),
            userData: null,
            error: null,
          },
          source: 'didit_api', // Indicate this came from Didit API, not local storage
        });
      } catch (diditError) {
        console.log(`❌ Session ${sessionId} not found in Didit API either:`, diditError);
        return NextResponse.json({ 
          error: "Session not found in local storage or Didit API" 
        }, { status: 404 });
      }
    }

    console.log(`✅ Found session: ${session.id} (status: ${session.status})`);

    // If session is completed, optionally fetch latest decision from Didit API
    if (session.status === "completed" && session.sessionId) {
      try {
        const decision = await SimpleKYCService.getSessionDecision(
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
      source: 'local_storage', // Indicate this came from local storage
    });
  } catch (error) {
    console.error("Session status error:", error);
    return NextResponse.json(
      { error: "Failed to get session status" },
      { status: 500 }
    );
  }
}
