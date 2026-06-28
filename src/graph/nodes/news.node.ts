// ============================================
// News Analysis Node
// AI Investment Research Agent
// ============================================

import type { GraphState } from "../state";
import { newsContextTool } from "@/tools/news.tool";
import { analyzeNews } from "@/chains/news.chain";

export async function newsNode(state: typeof GraphState.State) {
  try {
    if (!state.companyContext) {
      throw new Error("companyContext is missing");
    }

    // 1. Extract context using the specialized tool
    let researchContext = state.newsResearchContext;
    if (!researchContext) {
      researchContext = await newsContextTool.invoke({
        context: state.companyContext,
      });
    }

    // 2. Analyze the context using the chain
    const analysis = await analyzeNews(researchContext);

    return {
      newsResearchContext: researchContext,
      newsAnalysis: analysis,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      errors: [`News Node failed: ${errMessage}`],
    };
  }
}
