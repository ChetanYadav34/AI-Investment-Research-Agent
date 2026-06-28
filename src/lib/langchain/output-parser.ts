// ============================================
// LangChain Output Parser Utilities
// AI Investment Research Agent
// ============================================

import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import type { ZodParser } from "@/types/langchain.types";

/**
 * Creates a reusable LangChain StructuredOutputParser from a Zod schema.
 * 
 * @param schema - The Zod schema to parse and validate against
 * @returns A StructuredOutputParser that enforces the schema
 */
export function createOutputParser<T extends z.ZodTypeAny>(
  schema: T
): ZodParser<T> {
  return StructuredOutputParser.fromZodSchema(schema);
}

/**
 * Helper to get formatting instructions for a given parser.
 * This instructs the LLM on exactly how to structure its JSON.
 * 
 * @param parser - The parser to get instructions for
 * @returns A string containing the formatting instructions
 */
export function getFormatInstructions<T extends z.ZodTypeAny>(
  parser: ZodParser<T>
): string {
  return parser.getFormatInstructions();
}
