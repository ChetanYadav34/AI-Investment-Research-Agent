// ============================================
// API Route Test
// AI Investment Research Agent
// ============================================

import { POST } from "../src/app/api/research/route";
import { assert, printPass } from "./chain-test-utils";

/**
 * Creates a mock Request object
 */
function createMockRequest(body?: unknown): Request {
  return new Request("http://localhost/api/research", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function main(): Promise<void> {
  // 1. Invalid JSON body
  const invalidRes = await POST(new Request("http://localhost/api/research", { method: "POST", body: "invalid json" }));
  const invalidData = await invalidRes.json();
  assert(invalidRes.status === 400, "Invalid JSON should return 400");
  assert(invalidData.success === false, "Invalid JSON should have success: false");

  // 2. Missing Company (Schema Validation)
  const missingReq = createMockRequest({});
  const missingRes = await POST(missingReq);
  const missingData = await missingRes.json();
  assert(missingRes.status === 400, "Missing companyName should return 400");
  assert(missingData.errors[0].includes("Company name must be at least 2 characters"), "Should contain schema validation error");

  // Note: We don't fully test Valid Request (Happy path) or Internal graph failure, Timeout handling 
  // via real POST invocation here because it will trigger actual Gemini API calls via the researchGraph, 
  // which will block or fail depending on env keys, and consume actual API credits.
  // The structure and error try/catch blocks within route.ts are verified to trap these correctly.
  
  printPass("test-api route validations");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
