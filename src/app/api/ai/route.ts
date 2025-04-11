import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the AI service token from environment variables
    const aiServiceAuthToken = process.env.AI_SERVICE_AUTH_TOKEN;
    if (!aiServiceAuthToken) {
      console.error("AI_SERVICE_AUTH_TOKEN environment variable is not set.");
      return NextResponse.json(
        { error: "Internal Server Error: Service configuration missing." },
        { status: 500 }
      );
    }

    // Parse request body (model and messages)
    const body = await request.json();
    if (!body.model || !body.messages) {
      return NextResponse.json(
        { error: "Invalid request: missing required fields" },
        { status: 400 }
      );
    }

    // Fetch from the external AI service, but DO NOT await the full body yet
    const externalResponse = await fetch(
      "https://ai.eregistrations.org/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aiServiceAuthToken}`,
        },
        body: JSON.stringify(body),
        // IMPORTANT: Indicate that we expect a stream
        cache: "no-store", // Ensure fresh response
      }
    );

    // Check if the initial connection to the external API failed
    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error(
        `External API Error (${externalResponse.status}): ${errorText}`
      );
      return NextResponse.json(
        { error: `External API Error: ${errorText}` },
        { status: externalResponse.status }
      );
    }

    // Check if the response body exists and is readable
    if (!externalResponse.body) {
      return NextResponse.json(
        { error: "No response body received from external AI service." },
        { status: 502 }
      );
    }

    // Directly return the stream from the external API
    // Set appropriate headers for streaming
    const headers = new Headers({
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    return new NextResponse(externalResponse.body, {
      status: externalResponse.status,
      statusText: externalResponse.statusText,
      headers,
    });
  } catch (error) {
    console.error("Error in /api/ai route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
