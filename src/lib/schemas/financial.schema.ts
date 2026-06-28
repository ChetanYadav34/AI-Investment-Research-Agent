import { z } from "zod";
import { sourceSchema } from "./shared.schema";

const score1To10Schema = z.number().min(1).max(10);

export const financialResearchContextSchema = z.object({
  revenueProfile: z.string().min(1),
  profitabilityProfile: z.string().min(1),
  balanceSheetProfile: z.string().min(1),
  growthSignals: z.array(z.string().min(1)).max(5),
  valuationSignals: z.array(z.string().min(1)).max(5),
  keyFinancials: z.record(z.string(), z.string()),
  sources: z.array(sourceSchema).max(3),
});

export const financialAnalysisSchema = z.object({
  score: score1To10Schema,
  revenueGrowth: z.string().min(1),
  profitability: z.string().min(1),
  financialHealth: z.string().min(1),
  growthIndicators: z.string().min(1),
  investmentAttractiveness: z.string().min(1),
  reasoning: z.string().min(1),
  keyFinancials: z.record(z.string(), z.string()),
  sources: z.array(sourceSchema).max(3),
});
