// ============================================
// Investment Committee Chain
// AI Investment Research Agent
// ============================================

import type {
  CompanyAnalysis,
  FinancialAnalysis,
  InvestmentRecommendation,
  NewsAnalysis,
  RiskAnalysis,
  Source,
} from "@/types/agents.types";
import { SCORE_WEIGHTS } from "@/lib/constants";
import { investmentRecommendationSchema } from "@/lib/schemas";
import { buildCommitteePrompt } from "@/prompts";
import { getFormatInstructions } from "@/utils/parsers";
import type { ChainRunOptions } from "./chain.types";
import { executeStructuredChain } from "./chain.runner";

export interface RecommendationInput {
  companyAnalysis: CompanyAnalysis;
  financialAnalysis: FinancialAnalysis;
  newsAnalysis: NewsAnalysis;
  riskAnalysis: RiskAnalysis;
}

export function calculateInvestmentScore({
  companyAnalysis,
  financialAnalysis,
  newsAnalysis,
  riskAnalysis,
}: RecommendationInput): number {
  const weightedScore =
    companyAnalysis.companyScore * SCORE_WEIGHTS.company +
    financialAnalysis.score * SCORE_WEIGHTS.financial +
    newsAnalysis.score * SCORE_WEIGHTS.news +
    (10 - riskAnalysis.score) * SCORE_WEIGHTS.risk;

  return Math.round((weightedScore / 10) * 100);
}

export async function generateRecommendation(
  input: RecommendationInput,
  options: ChainRunOptions = {}
): Promise<InvestmentRecommendation> {
  const calculatedInvestmentScore = calculateInvestmentScore(input);
  const prompt = await buildCommitteePrompt(
    {
      ...input,
      calculatedInvestmentScore,
    },
    getFormatInstructions(investmentRecommendationSchema)
  );

  const recommendation = await executeStructuredChain({
    chainName: "InvestmentCommitteeChain",
    prompt,
    schema: investmentRecommendationSchema,
    options,
  });

  return investmentRecommendationSchema.parse({
    ...recommendation,
    investmentScore: calculatedInvestmentScore,
    scores: {
      ...recommendation.scores,
      company: input.companyAnalysis.companyScore,
      financial: input.financialAnalysis.score,
      news: input.newsAnalysis.score,
      risk: input.riskAnalysis.score,
      overall: calculatedInvestmentScore,
    },
    sourcesCited:
      recommendation.sourcesCited.length > 0
        ? recommendation.sourcesCited
        : dedupeSources([
            ...input.companyAnalysis.sources,
            ...input.financialAnalysis.sources,
            ...input.newsAnalysis.sources,
            ...input.riskAnalysis.sources,
          ]),
  });
}

function dedupeSources(sources: Source[]): Source[] {
  const seen = new Set<string>();

  return sources.filter((source) => {
    const key = `${source.title}:${source.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
