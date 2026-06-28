// ============================================
// Risk Analysis Prompt
// AI Investment Research Agent
// ============================================

import type { CompanyContext } from "@/types/agents.types";
import { createPromptBuilder } from "@/lib/langchain/prompt-builder";

export const riskAnalysisPrompt = createPromptBuilder({
  systemPrompt: "You are the Risk Analysis Agent. Analyze downside risk for a potential equity investment.",
  humanPrompt: `
Company context:
{context}

Return risk analysis with regulatoryRisks, competitionRisks, industryRisks,
executionRisks, overallRiskLevel, reasoning, sources, and a risk score from
1 to 10 where higher means riskier.
`
});

export async function buildRiskPrompt(
  context: CompanyContext,
  formatInstructions: string
): Promise<string> {
  return riskAnalysisPrompt.format({
    context: JSON.stringify(context, null, 2),
    format_instructions: formatInstructions,
  });
}
