// ============================================
// Company Analysis Node
// AI Investment Research Agent
// ============================================

import type { GraphState } from "../state";
import { companyContextTool } from "@/tools/company.tool";
import { analyzeCompany } from "@/chains/company.chain";

export async function companyNode(state: typeof GraphState.State) {
  try {
    if (!state.companyContext) {
      throw new Error("companyContext is missing");
    }

    // 1. Extract context using the specialized tool
    let researchContext = state.companyResearchContext;
    if (!researchContext) {
      researchContext = await companyContextTool.invoke({
        context: state.companyContext,
      });
    }

    // 2. Analyze the context using the chain
    const analysis = await analyzeCompany(researchContext);

    return {
      companyResearchContext: researchContext,
      companyAnalysis: analysis,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      errors: [`Company Node failed: ${errMessage}`],
    };
  }
}
