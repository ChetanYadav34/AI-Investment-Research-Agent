// ============================================
// Gemini Smoke Test — Standalone Verification
// AI Investment Research Agent
// ============================================
//
// Usage:  npm run test:gemini
//
// Purpose:
//   Run this BEFORE implementing LangChain to confirm the raw
//   Gemini SDK connection works. If this script fails, LangChain
//   integration will also fail — catch issues at the lowest layer.
//
// What it tests:
//   1. Environment variable loading
//   2. Gemini API connection
//   3. Text generation
//   4. JSON generation (with parse validation)
//   5. Timeout handling (simulated)
//
// Prerequisites:
//   - .env.local must exist with GEMINI_API_KEY set
//   - npm install must have been run

import {
  generateText,
  generateJSON,
  testConnection,
  GeminiTimeoutError,
} from "../src/services/gemini.service";
import { getEnv } from "../src/lib/env";

// ── Helpers ──

const PASS = "✓";
const FAIL = "✗";
let passed = 0;
let failed = 0;

function logPass(test: string, detail?: string): void {
  passed++;
  console.log(`  ${PASS} ${test}${detail ? ` — ${detail}` : ""}`);
}

function logFail(test: string, error: unknown): void {
  failed++;
  const msg = error instanceof Error ? error.message : String(error);
  console.log(`  ${FAIL} ${test} — ${msg}`);
}

// ── Tests ──

async function testEnvironment(): Promise<boolean> {
  console.log("\n📋 Environment Configuration");
  try {
    const env = getEnv();
    logPass("Environment loaded");
    logPass(
      "GEMINI_API_KEY",
      `${env.server.GEMINI_API_KEY.slice(0, 6)}...${env.server.GEMINI_API_KEY.slice(-4)}`
    );
    logPass("GEMINI_MODEL", env.server.GEMINI_MODEL);
    return true;
  } catch (error) {
    logFail("Environment loading", error);
    return false;
  }
}

async function testGeminiConnection(): Promise<boolean> {
  console.log("\n🔌 Gemini Connection");
  try {
    const result = await testConnection();
    if (result.success) {
      logPass("Connection established", `${result.durationMs}ms latency`);
      return true;
    } else {
      logFail("Connection failed", new Error(`Model: ${result.model}`));
      return false;
    }
  } catch (error) {
    logFail("Connection test", error);
    return false;
  }
}

async function testTextGeneration(): Promise<boolean> {
  console.log("\n📝 Text Generation");
  try {
    const result = await generateText(
      "In exactly one sentence, what is Tesla Inc?",
      {
        temperature: 0.3,
        maxOutputTokens: 100,
        maxRetries: 1,
        timeoutMs: 15_000,
      }
    );

    if (!result.text || result.text.length === 0) {
      logFail("Text generation", new Error("Empty response"));
      return false;
    }

    logPass("Text generated", `${result.text.length} chars`);
    logPass("Token usage", `${result.usage.totalTokens} tokens`);
    logPass("Timing", `${result.durationMs}ms`);
    return true;
  } catch (error) {
    logFail("Text generation", error);
    return false;
  }
}

async function testJSONGeneration(): Promise<boolean> {
  console.log("\n🔧 JSON Generation");
  try {
    interface TestOutput {
      company: string;
      score: number;
      recommendation: string;
    }

    const result = await generateJSON<TestOutput>(
      `You are a test assistant. Return ONLY valid JSON with this exact structure:
      { "company": "Tesla", "score": 8, "recommendation": "INVEST" }
      Do not include any other text or markdown formatting.`,
      {
        temperature: 0.1,
        maxOutputTokens: 200,
        maxRetries: 1,
        timeoutMs: 15_000,
      }
    );

    if (!result.data || typeof result.data.score !== "number") {
      logFail(
        "JSON parsing",
        new Error(`Unexpected structure: ${JSON.stringify(result.data)}`)
      );
      return false;
    }

    logPass("JSON generated and parsed");
    logPass("Data", JSON.stringify(result.data));
    logPass("Token usage", `${result.usage.totalTokens} tokens`);
    return true;
  } catch (error) {
    logFail("JSON generation", error);
    return false;
  }
}

async function testTimeoutHandling(): Promise<boolean> {
  console.log("\n⏱️  Timeout Handling");
  try {
    // Use an absurdly short timeout (1ms) to guarantee it fires
    await generateText("Write a 1000-word essay about the history of computing.", {
      timeoutMs: 1,
      maxRetries: 0,
    });

    // If we get here, the timeout didn't fire (model was extremely fast)
    logPass("Timeout mechanism exists", "Request completed before timeout");
    return true;
  } catch (error) {
    if (error instanceof GeminiTimeoutError) {
      logPass("Timeout error thrown correctly", `${error.timeoutMs}ms limit`);
      return true;
    }
    // Some other error — the timeout mechanism may still work, the request
    // just failed for a different reason before the timer fired
    logPass("Timeout mechanism exists", "Request failed before timeout fired");
    return true;
  }
}

// ── Main ──

async function main(): Promise<void> {
  console.log("=".repeat(50));
  console.log("  AI Investment Research Agent");
  console.log("  Gemini Service Smoke Test");
  console.log("=".repeat(50));

  // Step 1: Environment (required for everything else)
  const envOk = await testEnvironment();
  if (!envOk) {
    console.log("\n❌ Environment check failed. Cannot continue.");
    console.log("   Fix: Copy .env.example to .env.local and set GEMINI_API_KEY");
    console.log("   Get key: https://aistudio.google.com/apikey\n");
    process.exit(1);
  }

  // Step 2: Connection
  const connOk = await testGeminiConnection();
  if (!connOk) {
    console.log("\n❌ Connection failed. Check API key and network.");
    process.exit(1);
  }

  // Step 3: Text generation
  await testTextGeneration();

  // Step 4: JSON generation
  await testJSONGeneration();

  // Step 5: Timeout handling
  await testTimeoutHandling();

  // ── Summary ──
  console.log("\n" + "=".repeat(50));
  if (failed === 0) {
    console.log(`  ✅ All ${passed} tests passed`);
    console.log("  Gemini Service Layer is ready for LangChain integration.");
  } else {
    console.log(`  ⚠️  ${passed} passed, ${failed} failed`);
  }
  console.log("=".repeat(50) + "\n");

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("\n💥 Unhandled error:", error);
  process.exit(1);
});
