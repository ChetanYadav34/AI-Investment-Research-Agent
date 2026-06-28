// ============================================
// Company Research Tool
// AI Investment Research Agent
// ============================================

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { CompanyContext } from "@/types/agents.types";
import type { CompanyResearchContext } from "@/types/tools.types";
import { buildCompanyContextPrompt } from "@/prompts";
import { generateJSON } from "@/services";
import {
  companyContextSchema,
  companyResearchContextSchema,
} from "@/lib/schemas";
import { getFormatInstructions } from "@/utils/parsers";

export const companyContextTool = tool(
  async ({ context }) => {
    const prompt = await buildCompanyContextPrompt(
      context,
      getFormatInstructions(companyResearchContextSchema)
    );
    const result = await generateJSON<CompanyResearchContext>(
      prompt
    );
    return companyResearchContextSchema.parse(result.data);
  },
  {
    name: "company_context",
    description:
      "Prepares structured company research context using AI reasoning.",
    schema: z.object({
      context: companyContextSchema,
    }),
  }
);

export type CompanyResearchToolInput = {
  context: CompanyContext;
};
