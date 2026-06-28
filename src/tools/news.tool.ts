// ============================================
// News Analysis Tool
// AI Investment Research Agent
// ============================================

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { CompanyContext } from "@/types/agents.types";
import type { NewsResearchContext } from "@/types/tools.types";
import { buildNewsContextPrompt } from "@/prompts";
import { generateJSON } from "@/services";
import {
  companyContextSchema,
  newsResearchContextSchema,
} from "@/lib/schemas";
import { getFormatInstructions } from "@/utils/parsers";

export const newsContextTool = tool(
  async ({ context }) => {
    const prompt = await buildNewsContextPrompt(
      context,
      getFormatInstructions(newsResearchContextSchema)
    );
    const result = await generateJSON<NewsResearchContext>(prompt);
    return newsResearchContextSchema.parse(result.data);
  },
  {
    name: "news_context",
    description:
      "Generates structured news and sentiment context using AI reasoning.",
    schema: z.object({
      context: companyContextSchema,
    }),
  }
);

export type NewsAnalysisToolInput = {
  context: CompanyContext;
};
