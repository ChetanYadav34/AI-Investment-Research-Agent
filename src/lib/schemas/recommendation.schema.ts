import { z } from "zod";
import { sourceSchema } from "./shared.schema";

const score1To10Schema = z.number().min(1).max(10);
const percentageSchema = z.number().min(0).max(100);

export const investmentRecommendationSchema = z.object({
  recommendation: z.enum(["INVEST", "PASS"]),
  investmentScore: percentageSchema,
  confidence: percentageSchema,
  reasoning: z.string().min(1),
  pros: z.array(z.string().min(1)).max(5),
  cons: z.array(z.string().min(1)).max(5),
  summary: z.string().min(1),
  scores: z.object({
    company: score1To10Schema,
    financial: score1To10Schema,
    news: score1To10Schema,
    risk: score1To10Schema,
    overall: percentageSchema,
  }),
  sourcesCited: z.array(sourceSchema).max(3),
});
