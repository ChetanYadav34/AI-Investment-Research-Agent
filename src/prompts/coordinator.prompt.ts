// ============================================
// Research Coordinator Prompt
// AI Investment Research Agent
// ============================================

import { buildResearchContext } from "./base.prompt";
import { createPromptBuilder } from "@/lib/langchain/prompt-builder";

export const coordinatorPrompt = createPromptBuilder({
  systemPrompt: "You are the Research Coordinator for an investment research workflow. Resolve the input company into structured context for downstream agents.",
  humanPrompt: `
{researchContext}

Return the official company name, ticker symbol (if public), primary industry, sector, exchange (if public), and a concise business description.
`
});

export async function buildCoordinatorPrompt(
  companyName: string,
  formatInstructions: string
): Promise<string> {
  return coordinatorPrompt.format({
    researchContext: buildResearchContext(companyName),
    format_instructions: formatInstructions,
  });
}
