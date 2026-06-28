// ============================================
// LangChain Prompt Builder Utilities
// AI Investment Research Agent
// ============================================

import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { PromptTemplateConfig } from "@/types/langchain.types";
import { JSON_RESPONSE_RULES } from "@/prompts/base.prompt";

/**
 * Creates a reusable ChatPromptTemplate with standardized System and Human messages.
 * Expects the Human prompt to accept a {format_instructions} variable if structured output is needed.
 * 
 * @param config - The system and human prompt strings
 * @returns A constructed ChatPromptTemplate
 */
export function createPromptBuilder(config: PromptTemplateConfig): ChatPromptTemplate {
  return ChatPromptTemplate.fromMessages([
    ["system", `${config.systemPrompt}\n\n${JSON_RESPONSE_RULES}`],
    // Automatically inject a format_instructions placeholder if not already there,
    // though it's better practice for the humanPrompt to include it where it makes sense.
    ["human", config.humanPrompt.includes("{format_instructions}") 
      ? config.humanPrompt 
      : `${config.humanPrompt}\n\n{format_instructions}`],
  ]);
}
