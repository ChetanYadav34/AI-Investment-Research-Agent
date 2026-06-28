// ============================================
// Financial Analysis Tool
// AI Investment Research Agent
// ============================================

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { CompanyContext } from "@/types/agents.types";
import type { FinancialResearchContext } from "@/types/tools.types";
import { buildFinancialContextPrompt } from "@/prompts";
import { generateJSON } from "@/services";
import {
  companyContextSchema,
  financialResearchContextSchema,
} from "@/lib/schemas";
import { getFormatInstructions } from "@/utils/parsers";

export const financialContextTool = tool(
  async ({ context }) => {
    const prompt = await buildFinancialContextPrompt(
      context,
      getFormatInstructions(financialResearchContextSchema)
    );
    const result = await generateJSON<FinancialResearchContext>(
      prompt
    );
    return financialResearchContextSchema.parse(result.data);
  },
  {
    name: "financial_context",
    description:
      "Performs financial context extraction and structuring using AI reasoning.",
    schema: z.object({
      context: companyContextSchema,
    }),
  }
);

export type FinancialAnalysisToolInput = {
  context: CompanyContext;
};
