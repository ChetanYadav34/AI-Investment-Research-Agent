// ============================================
// Financial Analysis Node
// AI Investment Research Agent
// ============================================

import type { GraphState } from "../state";
import { financialContextTool } from "@/tools/financial.tool";
import { analyzeFinancials } from "@/chains/financial.chain";

export async function financialNode(state: typeof GraphState.State) {
  try {
    if (!state.companyContext) {
      throw new Error("companyContext is missing");
    }

    // 1. Extract context using the specialized tool
    let researchContext = state.financialResearchContext;
    if (!researchContext) {
      researchContext = await financialContextTool.invoke({
        context: state.companyContext,
      });
    }

    // 2. Analyze the context using the chain
    const analysis = await analyzeFinancials(researchContext);

    return {
      financialResearchContext: researchContext,
      financialAnalysis: analysis,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      errors: [`Financial Node failed: ${errMessage}`],
    };
  }
}
