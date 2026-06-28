// ============================================
// Shared Chain Runner
// AI Investment Research Agent
// ============================================

import type { z } from "zod";
import { generateText } from "@/services";
import { createStructuredParser, safeJsonParse } from "@/utils/parsers";
import type { ChainRunOptions } from "./chain.types";

export class ChainExecutionError extends Error {
  public readonly chainName: string;
  public readonly cause: unknown;

  constructor(chainName: string, message: string, cause: unknown) {
    super(message);
    this.name = "ChainExecutionError";
    this.chainName = chainName;
    this.cause = cause;
  }
}

interface ExecuteStructuredChainInput<TSchema extends z.ZodType> {
  chainName: string;
  prompt: string;
  schema: TSchema;
  options?: ChainRunOptions;
}

export async function executeStructuredChain<TSchema extends z.ZodType>({
  chainName,
  prompt,
  schema,
  options,
}: ExecuteStructuredChainInput<TSchema>): Promise<z.infer<TSchema>> {
  const generator = options?.generateText ?? generateText;
  const result = await generator(prompt, {
    temperature: 0.2,
    maxRetries: 1,
  });

  try {
    const parser = createStructuredParser(schema);
    const parsed = await parser.parse(result.text);
    return parsed as z.infer<TSchema>;
  } catch (error) {
    console.warn(`\n[${chainName}] StructuredOutputParser failed. Attempting fallback safeJsonParse...`);
    console.log(`===== RAW GEMINI RESPONSE =====\n${result.text}\n================================\n`);

    // Fallback: Attempt manual JSON parse
    const fallbackParse = safeJsonParse(result.text);
    
    if (fallbackParse.success && fallbackParse.data) {
      // Validate with the Zod schema
      const validationResult = schema.safeParse(fallbackParse.data);
      if (validationResult.success) {
        console.info(`[${chainName}] Fallback parsing succeeded.`);
        return validationResult.data as z.infer<TSchema>;
      } else {
        console.error(`[${chainName}] Fallback Zod validation failed:`, validationResult.error.issues);
      }
    }

    throw new ChainExecutionError(
      chainName,
      `${chainName} failed to generate a valid structured output`,
      error
    );
  }
}
