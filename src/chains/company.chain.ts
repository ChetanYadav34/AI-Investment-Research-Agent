// ============================================
// Company Analysis Chain
// AI Investment Research Agent
// ============================================

import type { CompanyAnalysis } from "@/types/agents.types";
import type { CompanyResearchContext } from "@/types/tools.types";
import { companyAnalysisSchema } from "@/lib/schemas";
import { buildCompanyPrompt } from "@/prompts";
import { getFormatInstructions } from "@/utils/parsers";
import type { ChainRunOptions } from "./chain.types";
import { executeStructuredChain } from "./chain.runner";

export async function analyzeCompany(
  context: CompanyResearchContext,
  options: ChainRunOptions = {}
): Promise<CompanyAnalysis> {
  const prompt = await buildCompanyPrompt(
    context,
    getFormatInstructions(companyAnalysisSchema)
  );

  return executeStructuredChain({
    chainName: "CompanyAnalysisChain",
    prompt,
    schema: companyAnalysisSchema,
    options,
  });
}
