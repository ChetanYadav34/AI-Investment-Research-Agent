// ============================================
// LangChain Core Types
// AI Investment Research Agent
// ============================================

import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

/**
 * Reusable type for a validated output parser.
 */
export type ZodParser<T extends z.ZodTypeAny> = StructuredOutputParser<T>;

/**
 * Standard configuration for LLM invocation.
 */
export interface LLMConfig {
  temperature?: number;
  maxOutputTokens?: number;
  maxRetries?: number;
}

/**
 * Base template configuration for prompt builders.
 */
export interface PromptTemplateConfig {
  systemPrompt: string;
  humanPrompt: string;
}
