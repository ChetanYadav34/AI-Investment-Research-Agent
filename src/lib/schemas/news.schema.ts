import { z } from "zod";
import { sourceSchema } from "./shared.schema";

const score1To10Schema = z.number().min(1).max(10);

export const newsResearchContextSchema = z.object({
  recentDevelopments: z.array(z.string().min(1)).max(5),
  positiveSignals: z.array(z.string().min(1)).max(5),
  negativeSignals: z.array(z.string().min(1)).max(5),
  sentimentSummary: z.string().min(1),
  notableCatalysts: z.array(z.string().min(1)).max(5),
  sources: z.array(sourceSchema).max(3),
});

export const newsAnalysisSchema = z.object({
  score: score1To10Schema,
  recentDevelopments: z.array(z.string().min(1)).max(5),
  positiveCatalysts: z.array(z.string().min(1)).max(5),
  negativeCatalysts: z.array(z.string().min(1)).max(5),
  marketSentiment: z.enum(["Bullish", "Bearish", "Neutral", "Mixed"]),
  reasoning: z.string().min(1),
  sources: z.array(sourceSchema).max(3),
});
