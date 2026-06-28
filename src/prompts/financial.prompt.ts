// ============================================
// Financial Analysis Prompt
// AI Investment Research Agent
// ============================================

import type { CompanyContext } from "@/types/agents.types";
import type { FinancialResearchContext } from "@/types/tools.types";
import { createPromptBuilder } from "@/lib/langchain/prompt-builder";

export const financialContextPrompt = createPromptBuilder({
  systemPrompt: "You prepare structured financial research context for investment agents.",
  humanPrompt: `
Prepare financial context for:
Company: {companyName}
Ticker: {ticker}

Focus on revenue profile, profitability, balance sheet health, growth signals,
valuation signals, key financial metrics, and useful citations.
Do not make an investment recommendation.
`
});

export async function buildFinancialContextPrompt(
  context: CompanyContext,
  formatInstructions: string
): Promise<string> {
  return financialContextPrompt.format({
    companyName: context.companyName,
    ticker: context.ticker ?? "Unknown",
    format_instructions: formatInstructions,
  });
}

export const financialAnalysisPrompt = createPromptBuilder({
  systemPrompt: "You are the Financial Analysis Agent. Analyze revenue quality, profitability, financial health, growth, and valuation attractiveness.",
  humanPrompt: `
Structured financial context:
{context}

Return financial analysis with revenueGrowth, profitability, financialHealth,
growthIndicators, investmentAttractiveness, reasoning, keyFinancials, sources,
and a financial score from 1 to 10.
`
});

export async function buildFinancePrompt(
  context: FinancialResearchContext,
  formatInstructions: string
): Promise<string> {
  return financialAnalysisPrompt.format({
    context: JSON.stringify(context, null, 2),
    format_instructions: formatInstructions,
  });
}
