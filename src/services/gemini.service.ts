// ============================================
// Gemini Service — AI Model Integration Layer
// AI Investment Research Agent
// ============================================
//
// Architecture Role:
//   This is the INFRASTRUCTURE layer (Layer 5 in Clean Architecture).
//   It wraps the Google Generative AI SDK and provides a clean,
//   typed interface that the rest of the application depends on.
//
// What this file does:
//   1. Initializes the Gemini client with env-validated API key
//   2. Provides `generateText()` — simple text generation
//   3. Provides `generateJSON()` — structured JSON generation
//   4. Handles ALL API errors with typed error classes
//   5. Implements retry logic with exponential backoff
//   6. Implements request timeout via AbortController
//   7. Logs generation metadata (tokens, timing)
//
// What this file does NOT do:
//   - Define prompts (that's `src/prompts/`)
//   - Define tools (that's `src/tools/`)
//   - Orchestrate agents (that's `src/agents/` + `src/graph/`)
//
// Why @google/generative-ai instead of @langchain/google-genai:
//   Phase 4 establishes the raw SDK connection.
//   Phase 5+ will layer LangChain on top for tool integration.
//   This gives us a fallback if LangChain abstractions break.

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { getEnv } from "@/lib/env";
import { GEMINI_CONFIG } from "@/lib/constants";

// ============================================
// Error Types
// ============================================

/**
 * Base error class for all Gemini-related errors.
 * Extends Error with structured metadata for logging and debugging.
 */
export class GeminiError extends Error {
  public readonly code: string;
  public readonly retryable: boolean;
  public readonly timestamp: string;

  constructor(message: string, code: string, retryable: boolean = false) {
    super(message);
    this.name = "GeminiError";
    this.code = code;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Thrown when the API key is missing or invalid.
 */
export class GeminiConfigError extends GeminiError {
  constructor(message: string) {
    super(message, "CONFIG_ERROR", false);
    this.name = "GeminiConfigError";
  }
}

/**
 * Thrown when the API returns a rate limit (429) or server error (5xx).
 */
export class GeminiRateLimitError extends GeminiError {
  constructor(message: string) {
    super(message, "RATE_LIMIT", true);
    this.name = "GeminiRateLimitError";
  }
}

/**
 * Thrown when JSON parsing of the model response fails.
 */
export class GeminiParseError extends GeminiError {
  public readonly rawResponse: string;

  constructor(message: string, rawResponse: string) {
    super(message, "PARSE_ERROR", true);
    this.name = "GeminiParseError";
    this.rawResponse = rawResponse;
  }
}

/**
 * Thrown when a request exceeds the configured timeout.
 * Non-retryable by default — if the model is too slow, retrying
 * the same prompt will likely hit the same timeout.
 */
export class GeminiTimeoutError extends GeminiError {
  public readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(
      `Gemini request timed out after ${timeoutMs}ms. ` +
        `Consider increasing the timeout or simplifying the prompt.`,
      "TIMEOUT",
      false
    );
    this.name = "GeminiTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

// ============================================
// Types
// ============================================

/**
 * Options for text generation requests.
 */
export interface GenerateOptions {
  /** Temperature (0-2). Lower = more deterministic. Default from GEMINI_CONFIG */
  temperature?: number;
  /** Maximum output tokens. Default from GEMINI_CONFIG */
  maxOutputTokens?: number;
  /** System instruction prepended to all prompts */
  systemInstruction?: string;
  /** Number of retry attempts on retryable errors. Default from GEMINI_CONFIG */
  maxRetries?: number;
  /** Per-request timeout in ms. Default from GEMINI_CONFIG (15s) */
  timeoutMs?: number;
}

/**
 * Result returned from generation methods.
 */
export interface GenerateResult {
  /** The generated text content */
  text: string;
  /** Token usage metadata */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** Generation timing in milliseconds */
  durationMs: number;
}

/**
 * Result returned from JSON generation.
 */
export interface GenerateJSONResult<T> extends Omit<GenerateResult, "text"> {
  /** The parsed JSON data */
  data: T;
  /** The raw text before parsing (for debugging) */
  rawText: string;
}

// ============================================
// Singleton Instance
// ============================================

let _genAI: GoogleGenerativeAI | null = null;
let _model: GenerativeModel | null = null;

/**
 * Returns the singleton GoogleGenerativeAI client.
 * Initializes on first call with validated environment config.
 *
 * @throws {GeminiConfigError} If GEMINI_API_KEY is missing
 */
function getClient(): GoogleGenerativeAI {
  if (!_genAI) {
    const env = getEnv();
    _genAI = new GoogleGenerativeAI(env.server.GEMINI_API_KEY);
  }
  return _genAI;
}

/**
 * Returns a GenerativeModel instance.
 * Uses the model specified in environment config (falls back to GEMINI_CONFIG.defaultModel).
 * A new instance is created when systemInstruction is provided (SDK constraint).
 */
function getModel(systemInstruction?: string): GenerativeModel {
  const env = getEnv();
  const client = getClient();

  // Create a new model instance if system instruction is provided
  // (system instruction is immutable per model instance in the SDK)
  if (systemInstruction) {
    return client.getGenerativeModel({
      model: env.server.GEMINI_MODEL,
      systemInstruction,
    });
  }

  // Reuse cached model for default calls
  if (!_model) {
    _model = client.getGenerativeModel({
      model: env.server.GEMINI_MODEL,
    });
  }
  return _model;
}

// ============================================
// Core Generation Methods
// ============================================

/**
 * Generates text from a prompt using Gemini.
 *
 * Features:
 * - AbortController timeout (default 15s, configurable)
 * - Retry with exponential backoff on 429/5xx
 * - Structured error classes for each failure mode
 * - Token usage and timing metadata
 *
 * @param prompt - The user prompt to send
 * @param options - Generation configuration
 * @returns The generated text with usage metadata
 *
 * @throws {GeminiTimeoutError} If request exceeds timeoutMs
 * @throws {GeminiConfigError} If API key is missing
 * @throws {GeminiRateLimitError} If rate limited after all retries
 * @throws {GeminiError} For all other API errors
 */
async function generateGeminiText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const {
    temperature = GEMINI_CONFIG.defaultTemperature,
    maxOutputTokens = GEMINI_CONFIG.maxOutputTokens,
    systemInstruction,
    maxRetries = GEMINI_CONFIG.maxRetries,
    timeoutMs = GEMINI_CONFIG.requestTimeoutMs,
  } = options;

  const model = getModel(systemInstruction);
  let lastError: Error | null = null;

  console.log(`[LLM] Using Gemini`);
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // ── Create AbortController for this attempt ──
    // Each retry gets its own controller so a previous timeout
    // doesn't cancel the next attempt.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const startTime = Date.now();

      const result = await model.generateContent(
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens,
          },
        },
        { signal: controller.signal } as never
      );

      // ── Clear timeout on success ──
      // Prevents the timer from firing after we've already received
      // a response, which would cause a spurious abort on the next call.
      clearTimeout(timeoutId);

      const durationMs = Date.now() - startTime;
      const response = result.response;
      const text = response.text();
      const usageMetadata = response.usageMetadata;

      console.log(
        `[Gemini] Generated ${text.length} chars in ${durationMs}ms ` +
          `(${usageMetadata?.totalTokenCount || "?"} tokens, attempt ${attempt + 1})`
      );

      return {
        text,
        usage: {
          promptTokens: usageMetadata?.promptTokenCount || 0,
          completionTokens: usageMetadata?.candidatesTokenCount || 0,
          totalTokens: usageMetadata?.totalTokenCount || 0,
        },
        durationMs,
      };
    } catch (error) {
      // ── Always clear the timeout to prevent memory leaks ──
      clearTimeout(timeoutId);

      // ── Handle AbortController timeout ──
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new GeminiTimeoutError(timeoutMs);
      }

      lastError = error instanceof Error ? error : new Error(String(error));

      // ── Classify error for retry logic ──
      const errorMessage = lastError.message.toLowerCase();
      const isRetryable =
        errorMessage.includes("429") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("503") ||
        errorMessage.includes("500") ||
        errorMessage.includes("overloaded");

      if (isRetryable && attempt < maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.warn(
          `[Gemini] Retryable error on attempt ${attempt + 1}/${maxRetries + 1}. ` +
            `Retrying in ${Math.round(backoffMs)}ms...`
        );
        await sleep(backoffMs);
        continue;
      }

      // ── Non-retryable or out of retries ──
      if (errorMessage.includes("api key") || errorMessage.includes("401")) {
        throw new GeminiConfigError(
          `Invalid Gemini API key. Check your GEMINI_API_KEY in .env.local`
        );
      }
      if (isRetryable) {
        throw new GeminiRateLimitError(
          `Gemini API rate limit exceeded after ${maxRetries + 1} attempts: ${lastError.message}`
        );
      }
      throw new GeminiError(
        `Gemini API error: ${lastError.message}`,
        "API_ERROR",
        false
      );
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new GeminiError(
    `Gemini generation failed after ${maxRetries + 1} attempts: ${lastError?.message}`,
    "EXHAUSTED_RETRIES",
    false
  );
}

/**
 * Generates text from Groq API (fallback).
 */
async function generateGroqText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const env = getEnv();
  if (!env.server.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured for fallback.");
  }
  
  console.log(`[LLM] Using Groq`);

  const {
    temperature = GEMINI_CONFIG.defaultTemperature,
    maxOutputTokens = GEMINI_CONFIG.maxOutputTokens,
    systemInstruction,
    timeoutMs = GEMINI_CONFIG.requestTimeoutMs,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  
  // Trim excessively large prompts to stay under TPM limits,
  // preserving the beginning (context) and end (schema instructions).
  let safePrompt = prompt;
  if (safePrompt.length > 25000) {
    const head = safePrompt.substring(0, 10000);
    const tail = safePrompt.substring(safePrompt.length - 10000);
    safePrompt = `${head}\n\n...[NON-ESSENTIAL CONTEXT TRUNCATED]...\n\n${tail}`;
  }
  
  messages.push({ role: "user", content: safePrompt });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.server.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: env.server.GROQ_MODEL,
        messages,
        temperature,
        max_tokens: Math.min(maxOutputTokens || 1024, 1024),
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    const durationMs = Date.now() - startTime;
    const text = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || {};
    
    console.log(
      `[Groq] Generated ${text.length} chars in ${durationMs}ms ` +
        `(${usage.total_tokens || "?"} tokens)`
    );

    return {
      text,
      usage: {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
      },
      durationMs,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new GeminiTimeoutError(timeoutMs); // Reuse timeout error for consistency upstream
    }
    throw error;
  }
}

/**
 * Orchestrator: Tries Gemini, falls back to Groq on infrastructure failures.
 */
export async function generateText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  try {
    return await generateGeminiText(prompt, options);
  } catch (error) {
    const isInfrastructureError =
      error instanceof GeminiTimeoutError ||
      error instanceof GeminiRateLimitError ||
      (error instanceof GeminiError && error.code === "EXHAUSTED_RETRIES") ||
      (error instanceof GeminiError && error.code === "API_ERROR");

    if (isInfrastructureError) {
      console.log(`[LLM] Gemini unavailable (${error instanceof Error ? error.message : String(error)})`);
      console.log(`[LLM] Switching to Groq`);
      return await generateGroqText(prompt, options);
    }
    
    // Throw config and parse errors
    throw error;
  }
}


/**
 * Generates structured JSON from a prompt using Gemini.
 * Automatically extracts JSON from markdown code blocks if present.
 *
 * @param prompt - The user prompt (should instruct JSON output)
 * @param options - Generation configuration
 * @returns The parsed JSON data with usage metadata
 *
 * @throws {GeminiParseError} If the response cannot be parsed as JSON
 * @throws {GeminiTimeoutError} If the request times out
 */
export async function generateJSON<T = Record<string, unknown>>(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateJSONResult<T>> {
  // Force lower temperature for structured output consistency
  const jsonOptions: GenerateOptions = {
    ...options,
    temperature: options.temperature ?? GEMINI_CONFIG.jsonTemperature,
  };

  const result = await generateText(prompt, jsonOptions);
  const rawText = result.text;

  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : rawText.trim();

    const data = JSON.parse(jsonString) as T;

    return {
      data,
      rawText,
      usage: result.usage,
      durationMs: result.durationMs,
    };
  } catch (parseError) {
    console.error("[Gemini] JSON parse failed. Raw response:", rawText);

    throw new GeminiParseError(
      `Failed to parse Gemini response as JSON: ${
        parseError instanceof Error ? parseError.message : "Unknown error"
      }`,
      rawText
    );
  }
}

// ============================================
// Utility Methods
// ============================================

/**
 * Tests the Gemini connection with a minimal prompt.
 * Useful for health checks and startup validation.
 */
export async function testConnection(): Promise<{
  success: boolean;
  model: string;
  durationMs: number;
}> {
  const env = getEnv();
  const startTime = Date.now();

  try {
    await generateText("Reply with: OK", {
      temperature: 0,
      maxOutputTokens: 10,
      maxRetries: 0,
      timeoutMs: 10_000,
    });

    return {
      success: true,
      model: env.server.GEMINI_MODEL,
      durationMs: Date.now() - startTime,
    };
  } catch {
    return {
      success: false,
      model: env.server.GEMINI_MODEL,
      durationMs: Date.now() - startTime,
    };
  }
}

/**
 * Resets the singleton instances (useful for testing).
 */
export function resetGeminiClient(): void {
  _genAI = null;
  _model = null;
}

// ============================================
// Internal Helpers
// ============================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
