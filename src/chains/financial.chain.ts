// ============================================
// Financial Analysis Chain
// AI Investment Research Agent
// ============================================

import type { FinancialAnalysis } from "@/types/agents.types";
import type { FinancialResearchContext } from "@/types/tools.types";
import { financialAnalysisSchema } from "@/lib/schemas";
import { buildFinancePrompt } from "@/prompts";
import { getFormatInstructions } from "@/utils/parsers";
import type { ChainRunOptions } from "./chain.types";
import { executeStructuredChain } from "./chain.runner";

export async function analyzeFinancials(
  context: FinancialResearchContext,
  options: ChainRunOptions = {}
): Promise<FinancialAnalysis> {
  const prompt = await buildFinancePrompt(
    context,
    getFormatInstructions(financialAnalysisSchema)
  );

  return executeStructuredChain({
    chainName: "FinancialAnalysisChain",
    prompt,
    schema: financialAnalysisSchema,
    options,
  });
}
