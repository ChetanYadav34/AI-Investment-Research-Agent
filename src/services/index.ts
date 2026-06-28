// ============================================
// Service Exports
// AI Investment Research Agent
// ============================================

export {
  generateText,
  generateJSON,
  testConnection,
  resetGeminiClient,
  GeminiError,
  GeminiConfigError,
  GeminiRateLimitError,
  GeminiParseError,
  GeminiTimeoutError,
} from "./gemini.service";

export type {
  GenerateOptions,
  GenerateResult,
  GenerateJSONResult,
} from "./gemini.service";
