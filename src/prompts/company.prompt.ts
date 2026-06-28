// ============================================
// Company Research Prompt
// AI Investment Research Agent
// ============================================

import type { CompanyContext } from "@/types/agents.types";
import type { CompanyResearchContext } from "@/types/tools.types";
import { createPromptBuilder } from "@/lib/langchain/prompt-builder";

export const companyContextPrompt = createPromptBuilder({
  systemPrompt: "You prepare structured company research context for investment agents.",
  humanPrompt: `
Prepare context for:
Company: {companyName}
Ticker: {ticker}
Industry: {industry}

Focus on business model, products, competitors, market position, strengths,
challenges, and useful citations. Do not make an investment recommendation.
`
});

export async function buildCompanyContextPrompt(
  context: CompanyContext,
  formatInstructions: string
): Promise<string> {
  return companyContextPrompt.format({
    companyName: context.companyName,
    ticker: context.ticker ?? "Unknown",
    industry: context.industry,
    format_instructions: formatInstructions,
  });
}

export const companyAnalysisPrompt = createPromptBuilder({
  systemPrompt: "You are the Company Research Agent. Analyze business quality, market position, competitive moat, and company fundamentals.",
  humanPrompt: `
Structured company context:
{context}

Return a company analysis with overview, business model, products/services,
industry position, competitive advantage, key metrics, strengths, weaknesses,
reasoning, sources, and a companyScore from 1 to 10.
`
});

export async function buildCompanyPrompt(
  context: CompanyResearchContext,
  formatInstructions: string
): Promise<string> {
  return companyAnalysisPrompt.format({
    context: JSON.stringify(context, null, 2),
    format_instructions: formatInstructions,
  });
}
