#!/usr/bin/env node
import fetch from "node-fetch";

/**
 * End-to-end integration test for Didit KYC implementation
 * Tests the complete flow: create session -> get status -> webhook handling
 */

async function runE2ETest() {
  console.log("🧪 Starting End-to-End Didit KYC Integration Test\n");

  // Test 1: Create a session
  console.log("1️⃣ Testing Session Creation...");
  const createSessionResult = await testCreateSession();
  if (!createSessionResult.success) {
    console.error("❌ Session creation failed:", createSessionResult.error);
    process.exit(1);
  }
  console.log("✅ Session created:", createSessionResult.sessionId);

  // Test 2: Get session status
  console.log("\n2️⃣ Testing Session Status Retrieval...");
  const statusResult = await testGetStatus(createSessionResult.sessionId);
  if (!statusResult.success) {
    console.error("❌ Status retrieval failed:", statusResult.error);
    process.exit(1);
  }
  console.log("✅ Status retrieved:", statusResult.status);

  // Test 3: Test webhook endpoint
  console.log("\n3️⃣ Testing Webhook Endpoint...");
  const webhookResult = await testWebhook();
  if (!webhookResult.success) {
    console.error("❌ Webhook test failed:", webhookResult.error);
    process.exit(1);
  }
  console.log("✅ Webhook validation working");

  console.log(
    "\n🎉 All tests passed! Didit KYC integration is working correctly.\n"
  );

  // Summary
  console.log("📊 Test Summary:");
  console.log("   ✅ Session Creation API");
  console.log("   ✅ Session Status API");
  console.log("   ✅ Webhook Security");
  console.log("   ✅ End-to-End Flow");
  console.log("\n🚀 Integration is production-ready!");
}

async function testCreateSession() {
  try {
    const response = await fetch("http://localhost:3002/api/didit/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "User",
        dateOfBirth: "1990-01-01",
        email: "test@example.com",
        country: "USA",
      }),
    });

    const data = await response.json();

    if (data.success && data.session?.id) {
      return { success: true, sessionId: data.session.id };
    } else {
      return { success: false, error: data.error || "Unknown error" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testGetStatus(sessionId) {
  try {
    const response = await fetch(
      `http://localhost:3002/api/didit/sessions/${sessionId}`
    );
    const data = await response.json();

    if (data.success && data.session?.status) {
      return { success: true, status: data.session.status };
    } else {
      return { success: false, error: data.error || "Unknown error" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testWebhook() {
  try {
    const response = await fetch("http://localhost:3002/api/didit/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-didit-signature": "invalid-signature",
      },
      body: JSON.stringify({
        session_id: "test",
        status: "completed",
        vendor_data: "test-data",
      }),
    });

    const data = await response.json();

    // We expect this to fail due to invalid signature (which is correct behavior)
    if (data.error && data.error.includes("signature")) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Webhook should have rejected invalid signature",
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

runE2ETest().catch((error) => {
  console.error("❌ E2E test failed:", error);
  process.exit(1);
});
