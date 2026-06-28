// ============================================
// Risk Analysis Chain
// AI Investment Research Agent
// ============================================

import type { CompanyContext, RiskAnalysis } from "@/types/agents.types";
import { riskAnalysisSchema } from "@/lib/schemas";
import { buildRiskPrompt } from "@/prompts";
import { getFormatInstructions } from "@/utils/parsers";
import type { ChainRunOptions } from "./chain.types";
import { executeStructuredChain } from "./chain.runner";

export async function analyzeRisk(
  context: CompanyContext,
  options: ChainRunOptions = {}
): Promise<RiskAnalysis> {
  const prompt = await buildRiskPrompt(
    context,
    getFormatInstructions(riskAnalysisSchema)
  );

  return executeStructuredChain({
    chainName: "RiskAnalysisChain",
    prompt,
    schema: riskAnalysisSchema,
    options,
  });
}
