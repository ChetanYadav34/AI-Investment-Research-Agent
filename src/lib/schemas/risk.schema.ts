import { z } from "zod";
import { sourceSchema } from "./shared.schema";

const score1To10Schema = z.number().min(1).max(10);

export const riskAnalysisSchema = z.object({
  score: score1To10Schema,
  regulatoryRisks: z.array(z.string().min(1)).max(5),
  competitionRisks: z.array(z.string().min(1)).max(5),
  industryRisks: z.array(z.string().min(1)).max(5),
  executionRisks: z.array(z.string().min(1)).max(5),
  overallRiskLevel: z.enum(["Low", "Medium", "High", "Critical"]),
  reasoning: z.string().min(1),
  sources: z.array(sourceSchema).max(3),
});
