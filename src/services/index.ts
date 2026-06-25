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
} from "./gemini.service";

export type {
  GenerateOptions,
  GenerateResult,
  GenerateJSONResult,
} from "./gemini.service";
