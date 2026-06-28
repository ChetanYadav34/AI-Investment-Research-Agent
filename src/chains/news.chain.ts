// ============================================
// News Analysis Chain
// AI Investment Research Agent
// ============================================

import type { NewsAnalysis } from "@/types/agents.types";
import type { NewsResearchContext } from "@/types/tools.types";
import { newsAnalysisSchema } from "@/lib/schemas";
import { buildNewsPrompt } from "@/prompts";
import { getFormatInstructions } from "@/utils/parsers";
import type { ChainRunOptions } from "./chain.types";
import { executeStructuredChain } from "./chain.runner";

export async function analyzeNews(
  context: NewsResearchContext,
  options: ChainRunOptions = {}
): Promise<NewsAnalysis> {
  const prompt = await buildNewsPrompt(
    context,
    getFormatInstructions(newsAnalysisSchema)
  );

  return executeStructuredChain({
    chainName: "NewsAnalysisChain",
    prompt,
    schema: newsAnalysisSchema,
    options,
  });
}
