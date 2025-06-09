/**
 * Minimal session creation API endpoint
 * Follows official Didit API flow
 */

import { SimpleKYCService } from "@/services/didit/session-service";
import type { UserKYCData } from "@/types/didit/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userData: UserKYCData = await request.json();

    // Basic validation
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.dateOfBirth) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, dateOfBirth" },
        { status: 400 }
      );
    }

    // Create session using simple service
    const session = await SimpleKYCService.createSession(userData);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        verificationUrl: session.verificationUrl,
        status: session.status,
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create session" },
      { status: 500 }
    );
  }
}
