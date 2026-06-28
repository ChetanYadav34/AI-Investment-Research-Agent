// ============================================
// Coordinator Node
// AI Investment Research Agent
// ============================================

import { buildCoordinatorPrompt } from "@/prompts/coordinator.prompt";
import { generateJSON } from "@/services/gemini.service";
import { companyContextSchema } from "@/lib/schemas/company.schema";
import { getFormatInstructions } from "@/lib/langchain/output-parser";
import { createOutputParser } from "@/lib/langchain/output-parser";
import type { GraphState } from "../state";

export async function coordinatorNode(state: typeof GraphState.State) {
  try {
    if (!state.companyName) {
      throw new Error("companyName is required to start the workflow");
    }

    const parser = createOutputParser(companyContextSchema);
    const formatInstructions = getFormatInstructions(parser);
    
    const prompt = await buildCoordinatorPrompt(
      state.companyName,
      formatInstructions
    );

    const result = await generateJSON(prompt);
    const parsed = await parser.parse(result.rawText);

    return {
      companyContext: parsed,
      executionStatus: "RUNNING",
    };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      executionStatus: "FAILED",
      errors: [`Coordinator failed: ${errMessage}`],
    };
  }
}
