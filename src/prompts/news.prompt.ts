// ============================================
// News Analysis Prompt
// AI Investment Research Agent
// ============================================

import type { CompanyContext } from "@/types/agents.types";
import type { NewsResearchContext } from "@/types/tools.types";
import { createPromptBuilder } from "@/lib/langchain/prompt-builder";

export const newsContextPrompt = createPromptBuilder({
  systemPrompt: "You prepare structured news and sentiment context for investment agents.",
  humanPrompt: `
Prepare news and sentiment context for:
Company: {companyName}
Industry: {industry}

Focus on recent developments, positive signals, negative signals, sentiment,
notable catalysts, and useful citations. Do not make an investment recommendation.
`
});

export async function buildNewsContextPrompt(
  context: CompanyContext,
  formatInstructions: string
): Promise<string> {
  return newsContextPrompt.format({
    companyName: context.companyName,
    industry: context.industry,
    format_instructions: formatInstructions,
  });
}

export const newsAnalysisPrompt = createPromptBuilder({
  systemPrompt: "You are the News Analysis Agent. Analyze news sentiment, positive catalysts, negative catalysts, and recent market context.",
  humanPrompt: `
Structured news context:
{context}

Return news analysis with recentDevelopments, positiveCatalysts,
negativeCatalysts, marketSentiment, reasoning, sources, and a news score from
1 to 10.
`
});

export async function buildNewsPrompt(
  context: NewsResearchContext,
  formatInstructions: string
): Promise<string> {
  return newsAnalysisPrompt.format({
    context: JSON.stringify(context, null, 2),
    format_instructions: formatInstructions,
  });
}
