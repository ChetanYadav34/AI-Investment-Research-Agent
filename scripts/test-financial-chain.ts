import { analyzeFinancials } from "../src/chains";
import { financialResearchContext } from "./chain-test-fixtures";
import {
  assert,
  createMockGenerator,
  expectChainError,
  printPass,
} from "./chain-test-utils";

async function main(): Promise<void> {
  let promptChecked = false;

  const result = await analyzeFinancials(financialResearchContext, {
    generateText: createMockGenerator(
      JSON.stringify({
        score: 7,
        revenueGrowth: "Growth is positive but moderating.",
        profitability: "Margins remain positive.",
        financialHealth: "Balance sheet is strong.",
        growthIndicators: "Energy storage and software support growth.",
        investmentAttractiveness: "Attractive but valuation-sensitive.",
        reasoning: "Healthy financial base.",
        keyFinancials: { Revenue: "$96B" },
        sources: [{ title: "Tesla Financials", url: "https://ir.tesla.com" }],
      }),
      (prompt) => {
        assert(prompt.includes("Structured financial context"), "Prompt missing context");
        assert(prompt.includes("keyFinancials"), "Prompt missing format instructions");
        promptChecked = true;
      }
    ),
  });

  assert(promptChecked, "Prompt was not executed");
  assert(result.score === 7, "Parsed financial score mismatch");

  await expectChainError(() =>
    analyzeFinancials(financialResearchContext, {
      generateText: createMockGenerator(JSON.stringify({ score: 99 })),
    })
  );

  printPass("test-financial-chain");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
