import { analyzeRisk } from "../src/chains";
import { companyContext } from "./chain-test-fixtures";
import {
  assert,
  createMockGenerator,
  expectChainError,
  printPass,
} from "./chain-test-utils";

async function main(): Promise<void> {
  let promptChecked = false;

  const result = await analyzeRisk(companyContext, {
    generateText: createMockGenerator(
      JSON.stringify({
        score: 5,
        regulatoryRisks: ["Autonomy approval uncertainty"],
        competitionRisks: ["BYD and legacy OEMs"],
        industryRisks: ["EV adoption volatility"],
        executionRisks: ["Manufacturing execution"],
        overallRiskLevel: "Medium",
        reasoning: "Risks are material but manageable.",
        sources: [{ title: "S&P Global", url: "https://spglobal.com" }],
      }),
      (prompt) => {
        assert(prompt.includes("Company context"), "Prompt missing context");
        assert(prompt.includes("overallRiskLevel"), "Prompt missing format instructions");
        promptChecked = true;
      }
    ),
  });

  assert(promptChecked, "Prompt was not executed");
  assert(result.overallRiskLevel === "Medium", "Parsed risk level mismatch");

  await expectChainError(() =>
    analyzeRisk(companyContext, {
      generateText: createMockGenerator(JSON.stringify({ score: 11 })),
    })
  );

  printPass("test-risk-chain");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
