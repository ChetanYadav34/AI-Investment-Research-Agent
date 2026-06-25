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
//   6. Logs generation metadata (tokens, timing)
//
// What this file does NOT do:
//   - Define prompts (that's `src/prompts/`)
//   - Define tools (that's `src/tools/`)
//   - Orchestrate agents (that's `src/agents/` + `src/graph/`)
//
// Why @google/generative-ai instead of @langchain/google-genai:
//   Phase 4 establishes the raw SDK connection.
//   Phase 6 will layer LangChain on top for tool integration.
//   This gives us a fallback if LangChain abstractions break.

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { getEnv } from "@/lib/env";

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

// ============================================
// Types
// ============================================

/**
 * Options for text generation requests.
 */
export interface GenerateOptions {
  /** Temperature (0-2). Lower = more deterministic. Default: 0.7 */
  temperature?: number;
  /** Maximum output tokens. Default: 4096 */
  maxOutputTokens?: number;
  /** System instruction prepended to all prompts */
  systemInstruction?: string;
  /** Number of retry attempts on retryable errors. Default: 2 */
  maxRetries?: number;
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
 * Returns the singleton GenerativeModel instance.
 * Uses the model specified in environment config (default: gemini-2.5-flash).
 */
function getModel(systemInstruction?: string): GenerativeModel {
  const env = getEnv();
  const client = getClient();

  // Create a new model instance if system instruction is provided
  // (system instruction is immutable per model instance)
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
 * @param prompt - The user prompt to send
 * @param options - Generation configuration
 * @returns The generated text with usage metadata
 *
 * @throws {GeminiConfigError} If API key is missing
 * @throws {GeminiRateLimitError} If rate limited (retryable)
 * @throws {GeminiError} For all other API errors
 *
 * @example
 * ```ts
 * const result = await generateText(
 *   "Analyze Tesla's competitive position",
 *   { temperature: 0.3, systemInstruction: "You are a financial analyst." }
 * );
 * console.log(result.text);
 * console.log(`Tokens: ${result.usage.totalTokens}`);
 * ```
 */
export async function generateText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const {
    temperature = 0.7,
    maxOutputTokens = 4096,
    systemInstruction,
    maxRetries = 2,
  } = options;

  const model = getModel(systemInstruction);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      });

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
      lastError = error instanceof Error ? error : new Error(String(error));

      // Classify error for retry logic
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

      // Non-retryable or out of retries
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
 * Generates structured JSON from a prompt using Gemini.
 * Automatically extracts JSON from markdown code blocks if present.
 *
 * @param prompt - The user prompt (should instruct JSON output)
 * @param options - Generation configuration
 * @returns The parsed JSON data with usage metadata
 *
 * @throws {GeminiParseError} If the response cannot be parsed as JSON
 *
 * @example
 * ```ts
 * interface Analysis { score: number; reasoning: string }
 *
 * const result = await generateJSON<Analysis>(
 *   "Analyze Tesla. Return JSON: { score: number, reasoning: string }",
 *   { temperature: 0.3 }
 * );
 * console.log(result.data.score); // 8
 * ```
 */
export async function generateJSON<T = Record<string, unknown>>(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateJSONResult<T>> {
  // Force lower temperature for structured output
  const jsonOptions: GenerateOptions = {
    ...options,
    temperature: options.temperature ?? 0.3,
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
 *
 * @returns true if the connection is successful
 * @throws {GeminiConfigError} If the API key is invalid
 */
export async function testConnection(): Promise<{
  success: boolean;
  model: string;
  durationMs: number;
}> {
  const env = getEnv();
  const startTime = Date.now();

  try {
    const result = await generateText("Reply with: OK", {
      temperature: 0,
      maxOutputTokens: 10,
      maxRetries: 0,
    });

    return {
      success: true,
      model: env.server.GEMINI_MODEL,
      durationMs: Date.now() - startTime,
    };
  } catch (error) {
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
