import { z } from "zod";
import { sourceSchema } from "./shared.schema";

const score1To10Schema = z.number().min(1).max(10);

export const companyContextSchema = z.object({
  companyName: z.string().min(1),
  ticker: z.string().min(1).nullable(),
  industry: z.string().min(1),
  sector: z.string().min(1),
  exchange: z.string().min(1).nullable(),
  description: z.string().min(1),
});

export const companyResearchContextSchema = z.object({
  overview: z.string().min(1),
  businessModel: z.string().min(1),
  productsAndServices: z.array(z.string().min(1)).max(5),
  competitors: z.array(z.string().min(1)).max(5),
  marketPosition: z.string().min(1),
  keyStrengths: z.array(z.string().min(1)).max(5),
  keyChallenges: z.array(z.string().min(1)).max(5),
  sources: z.array(sourceSchema).max(3),
});

export const companyAnalysisSchema = z.object({
  companyScore: score1To10Schema,
  overview: z.string().min(1),
  businessModel: z.string().min(1),
  productsAndServices: z.array(z.string().min(1)).max(5),
  industryPosition: z.string().min(1),
  competitiveAdvantage: z.string().min(1),
  keyMetrics: z.record(z.string(), z.string()),
  strengths: z.array(z.string().min(1)).max(5),
  weaknesses: z.array(z.string().min(1)).max(5),
  reasoning: z.string().min(1),
  sources: z.array(sourceSchema).max(3),
});
