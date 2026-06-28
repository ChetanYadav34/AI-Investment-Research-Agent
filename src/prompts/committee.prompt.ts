// ============================================
// Investment Committee Prompt
// AI Investment Research Agent
// ============================================

import type {
  CompanyAnalysis,
  FinancialAnalysis,
  NewsAnalysis,
  RiskAnalysis,
} from "@/types/agents.types";
import { SCORE_WEIGHTS } from "@/lib/constants";
import { createPromptBuilder } from "@/lib/langchain/prompt-builder";

interface CommitteePromptInput {
  companyAnalysis: CompanyAnalysis;
  financialAnalysis: FinancialAnalysis;
  newsAnalysis: NewsAnalysis;
  riskAnalysis: RiskAnalysis;
  calculatedInvestmentScore: number;
}

export const committeePrompt = createPromptBuilder({
  systemPrompt: "You are the Investment Committee Agent. Synthesize specialist analyses into an investment recommendation.",
  humanPrompt: `
Scoring weights:
{scoreWeights}

Calculated investmentScore:
{calculatedInvestmentScore}

Inputs:
{analyses}

Use the calculated investmentScore exactly. Risk score is inverted in the
final investment score because higher risk is worse. Generate recommendation,
confidence, pros, cons, executive summary, reasoning, score breakdown, and
aggregated sources.
`
});

export async function buildCommitteePrompt(
  input: CommitteePromptInput,
  formatInstructions: string
): Promise<string> {
  const { calculatedInvestmentScore, ...analyses } = input;

  return committeePrompt.format({
    scoreWeights: JSON.stringify(SCORE_WEIGHTS, null, 2),
    calculatedInvestmentScore,
    analyses: JSON.stringify(analyses, null, 2),
    format_instructions: formatInstructions,
  });
}
