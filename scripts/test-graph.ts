import { companyNode as cNode } from "../src/graph/nodes/company.node";
import { committeeNode as comNode } from "../src/graph/nodes/committee.node";
import { assert, printPass } from "./chain-test-utils";

async function main(): Promise<void> {
  // 1. Missing context test
  const missingContextState = {
    companyName: "",
    companyContext: null,
    companyResearchContext: null,
    financialResearchContext: null,
    newsResearchContext: null,
    companyAnalysis: null,
    financialAnalysis: null,
    newsAnalysis: null,
    riskAnalysis: null,
    finalRecommendation: null,
    executionStatus: "IDLE" as const,
    errors: [],
  };

  const cResult = await cNode(missingContextState);
  assert(
    cResult.errors && cResult.errors.length > 0 && cResult.errors[0].includes("companyContext is missing"),
    "Company node should fail when context is missing"
  );

  const comResult = await comNode(missingContextState);
  assert(
    comResult.errors && comResult.errors.length > 0 && comResult.errors[0].includes("analyses are missing"),
    "Committee node should fail when analyses are missing"
  );

  // Note: we can't fully run comNode(committeeState) in test because it calls generateRecommendation which uses LLM directly or via options,
  // wait, generateRecommendation is from committee.chain.ts which calls executeStructuredChain. We didn't pass options with mock generator,
  // so it will attempt real Gemini call unless we pass options. But we didn't pass options in committeeNode.
  
  // So testing actual graph nodes that do real I/O isn't feasible here without a mock server or patching `global.fetch`.
  
  printPass("test-graph logic validation");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
