// ============================================
// Shared Chain Types
// AI Investment Research Agent
// ============================================

import type { GenerateOptions, GenerateResult } from "@/services";

export type ChainTextGenerator = (
  prompt: string,
  options?: GenerateOptions
) => Promise<Pick<GenerateResult, "text">>;

export interface ChainRunOptions {
  generateText?: ChainTextGenerator;
}
