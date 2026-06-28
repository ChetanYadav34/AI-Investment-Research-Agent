// ============================================
// Investment Committee Node
// AI Investment Research Agent
// ============================================

import type { GraphState } from "../state";
import { generateRecommendation } from "@/chains/committee.chain";

export async function committeeNode(state: typeof GraphState.State) {
  try {
    const { companyAnalysis, financialAnalysis, newsAnalysis, riskAnalysis } = state;

    if (!companyAnalysis || !financialAnalysis || !newsAnalysis || !riskAnalysis) {
      throw new Error("One or more specialist analyses are missing");
    }

    // Generate the final synthesized recommendation
    const recommendation = await generateRecommendation({
      companyAnalysis,
      financialAnalysis,
      newsAnalysis,
      riskAnalysis,
    });

    return {
      finalRecommendation: recommendation,
      executionStatus: "COMPLETED",
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      executionStatus: "FAILED",
      errors: [`Committee Node failed: ${errMessage}`],
    };
  }
}
