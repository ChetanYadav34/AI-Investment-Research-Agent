// ============================================
// Risk Analysis Node
// AI Investment Research Agent
// ============================================

import type { GraphState } from "../state";
import { analyzeRisk } from "@/chains/risk.chain";

export async function riskNode(state: typeof GraphState.State) {
  try {
    if (!state.companyContext) {
      throw new Error("companyContext is missing");
    }

    // Analyze the context using the chain
    const analysis = await analyzeRisk(state.companyContext);

    return {
      riskAnalysis: analysis,
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      errors: [`Risk Node failed: ${errMessage}`],
    };
  }
}
