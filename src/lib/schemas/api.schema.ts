// ============================================
// API Schemas
// AI Investment Research Agent
// ============================================

import { z } from "zod";

export const researchRequestSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
});

export type ResearchRequest = z.infer<typeof researchRequestSchema>;
