// ============================================
// Application Constants
// AI Investment Research Agent
// ============================================

export const APP_CONFIG = {
  name: "AI Investment Research Agent",
  description:
    "Multi-agent AI system for comprehensive investment research and analysis",
  version: "1.0.0",
} as const;

/**
 * Scoring weights for the Investment Score formula.
 * Financial (35%) + Company (25%) + News (20%) + Risk-inverted (20%) = 100%
 */
export const SCORE_WEIGHTS = {
  financial: 0.35,
  company: 0.25,
  news: 0.2,
  risk: 0.2,
} as const;

/**
 * Decision thresholds for INVEST vs PASS.
 */
export const DECISION_THRESHOLDS = {
  invest: 70,
  pass: 50,
} as const;

/**
 * Agent identifiers used in logging and progress tracking.
 */
export const AGENT_NAMES = {
  coordinator: "Research Coordinator",
  company: "Company Research Agent",
  finance: "Financial Analysis Agent",
  news: "News Analysis Agent",
  risk: "Risk Analysis Agent",
  committee: "Investment Committee",
} as const;

/**
 * API configuration.
 */
export const API_CONFIG = {
  researchEndpoint: "/api/research",
  timeoutMs: 120_000,
} as const;

/**
 * Supported Gemini model identifiers.
 * Centralized here so service files never hardcode model names.
 * Changing a model is a single-line change, not a codebase-wide find-replace.
 */
export const GEMINI_MODELS = {
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-pro",
} as const;

/**
 * Gemini service configuration defaults.
 */
export const GEMINI_CONFIG = {
  /** Default model for all generation requests */
  defaultModel: GEMINI_MODELS.FLASH,
  /** Default temperature for text generation */
  defaultTemperature: 0.7,
  /** Lower temperature for structured JSON output */
  jsonTemperature: 0.3,
  /** Maximum output tokens per request */
  maxOutputTokens: 8192,
  /** Per-request timeout in milliseconds */
  requestTimeoutMs: 90_000,
  /** Number of retry attempts on retryable errors */
  maxRetries: 2,
} as const;

