// ============================================
// Environment Configuration — Typed & Validated
// AI Investment Research Agent
// ============================================
// Why this file exists:
// - Validates ALL required env vars at startup, not at first API call
// - Provides typed access: `env.GEMINI_API_KEY` instead of `process.env.GEMINI_API_KEY!`
// - Fails fast with actionable error messages
// - Single source of truth for configuration

/**
 * Server-side environment variables (never exposed to the browser).
 * Validated once on first access, then cached.
 */
interface ServerEnv {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
}

/**
 * Client-side environment variables (prefixed with NEXT_PUBLIC_).
 * Safe to use in browser code.
 */
interface ClientEnv {
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_URL: string;
}

/**
 * Complete application configuration.
 */
export interface AppEnv {
  server: ServerEnv;
  client: ClientEnv;
}

// ── Cache ──
let _cachedEnv: AppEnv | null = null;

/**
 * Validates and returns typed environment configuration.
 * Throws with a clear message listing ALL missing variables (not just the first).
 *
 * @throws {Error} If any required environment variable is missing
 *
 * @example
 * ```ts
 * const env = getEnv();
 * const model = env.server.GEMINI_MODEL; // "gemini-2.5-flash"
 * ```
 */
export function getEnv(): AppEnv {
  // Return cached config if already validated
  if (_cachedEnv) return _cachedEnv;

  const missing: string[] = [];

  // ── Validate required server variables ──
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) missing.push("GEMINI_API_KEY");

  // ── Throw if any required vars are missing ──
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n` +
        missing.map((v) => `   - ${v}`).join("\n") +
        `\n\n` +
        `To fix this:\n` +
        `1. Copy .env.example to .env.local\n` +
        `2. Fill in the missing values\n` +
        `3. Restart the dev server\n` +
        `\n` +
        `Get your Gemini API key at: https://aistudio.google.com/apikey`
    );
  }

  // ── Build validated config ──
  _cachedEnv = {
    server: {
      GEMINI_API_KEY: GEMINI_API_KEY!,
      GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    },
    client: {
      NEXT_PUBLIC_APP_NAME:
        process.env.NEXT_PUBLIC_APP_NAME || "AI Investment Research Agent",
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  };

  return _cachedEnv;
}

/**
 * Returns client-safe environment variables only.
 * Can be used in client components without exposing server secrets.
 */
export function getClientEnv(): ClientEnv {
  return {
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME || "AI Investment Research Agent",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}

/**
 * Resets the cached environment (useful for testing).
 */
export function resetEnvCache(): void {
  _cachedEnv = null;
}
