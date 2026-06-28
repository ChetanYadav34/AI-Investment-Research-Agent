// ============================================
// LangChain Chain Utilities (Base LLM Wrapper)
// AI Investment Research Agent
// ============================================

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GEMINI_CONFIG, GEMINI_MODELS } from "@/lib/constants";
import { getEnv } from "@/lib/env";
import type { LLMConfig } from "@/types/langchain.types";

/**
 * Creates and returns a configured ChatGoogleGenerativeAI instance.
 * Serves as the Base LLM Wrapper for all LangChain operations.
 * 
 * @param config - Optional configuration overrides (temperature, etc.)
 * @returns A ChatGoogleGenerativeAI model instance
 */
export function getBaseLLM(config?: LLMConfig): ChatGoogleGenerativeAI {
  const env = getEnv();
  
  return new ChatGoogleGenerativeAI({
    apiKey: env.server.GEMINI_API_KEY,
    model: env.server.GEMINI_MODEL || GEMINI_MODELS.FLASH,
    temperature: config?.temperature ?? GEMINI_CONFIG.defaultTemperature,
    maxOutputTokens: config?.maxOutputTokens ?? GEMINI_CONFIG.maxOutputTokens,
    maxRetries: config?.maxRetries ?? GEMINI_CONFIG.maxRetries,
  });
}

/**
 * Creates an LLM specifically tuned for strict structured JSON output.
 * Uses a lower temperature by default.
 */
export function getStructuredLLM(config?: LLMConfig): ChatGoogleGenerativeAI {
  return getBaseLLM({
    temperature: GEMINI_CONFIG.jsonTemperature,
    ...config,
  });
}
