import {
  calculateInvestmentScore,
  generateRecommendation,
} from "../src/chains";
import {
  companyAnalysis,
  financialAnalysis,
  newsAnalysis,
  riskAnalysis,
} from "./chain-test-fixtures";
import {
  assert,
  createMockGenerator,
  expectChainError,
  printPass,
} from "./chain-test-utils";

const input = {
  companyAnalysis,
  financialAnalysis,
  newsAnalysis,
  riskAnalysis,
};

async function main(): Promise<void> {
  const calculatedScore = calculateInvestmentScore(input);
  assert(calculatedScore === 64, "Calculated investment score mismatch");

  let promptChecked = false;

  const result = await generateRecommendation(input, {
    generateText: createMockGenerator(
      JSON.stringify({
        recommendation: "INVEST",
        investmentScore: 1,
        confidence: 82,
        reasoning: "Strong company and financial profile with manageable risks.",
        pros: ["Strong brand", "Energy growth"],
        cons: ["Competition", "Valuation"],
        summary: "Tesla remains attractive with execution risk.",
        scores: {
          company: 1,
          financial: 1,
          news: 1,
          risk: 1,
          overall: 1,
        },
        sourcesCited: [],
      }),
      (prompt) => {
        assert(prompt.includes("Calculated investmentScore"), "Prompt missing score");
        assert(prompt.includes(String(calculatedScore)), "Prompt missing calculated value");
        promptChecked = true;
      }
    ),
  });

  assert(promptChecked, "Prompt was not executed");
  assert(result.investmentScore === calculatedScore, "Score was not normalized");
  assert(result.scores.company === companyAnalysis.companyScore, "Company score mismatch");
  assert(result.sourcesCited.length > 0, "Sources were not aggregated");

  await expectChainError(() =>
    generateRecommendation(input, {
      generateText: createMockGenerator(JSON.stringify({ recommendation: "WAIT" })),
    })
  );

  printPass("test-committee-chain");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
