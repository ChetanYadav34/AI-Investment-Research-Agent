// ============================================
// Output Parsers
// AI Investment Research Agent
// ============================================

import { StructuredOutputParser } from "@langchain/core/output_parsers";
import type { z } from "zod";

export function createStructuredParser<TSchema extends z.ZodType>(
  schema: TSchema
) {
  return StructuredOutputParser.fromZodSchema(schema);
}

export function getFormatInstructions<TSchema extends z.ZodType>(
  schema: TSchema
): string {
  return createStructuredParser(schema).getFormatInstructions();
}

/**
 * Safely parses a JSON string with error handling.
 * Used as a fallback when StructuredOutputParser fails.
 */
export function safeJsonParse<T>(text: string): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();

    const parsed = JSON.parse(jsonString) as T;
    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown parse error",
    };
  }
}
