import { analyzeCompany } from "../src/chains";
import { companyResearchContext } from "./chain-test-fixtures";
import {
  assert,
  createMockGenerator,
  expectChainError,
  printPass,
} from "./chain-test-utils";

async function main(): Promise<void> {
  let promptChecked = false;

  const result = await analyzeCompany(companyResearchContext, {
    generateText: createMockGenerator(
      JSON.stringify({
        companyScore: 8,
        overview: "Tesla is a leading EV company.",
        businessModel: "Vehicles, software, charging, and energy.",
        productsAndServices: ["Model 3", "Model Y"],
        industryPosition: "Leading EV position.",
        competitiveAdvantage: "Brand and charging network.",
        keyMetrics: { Brand: "Global" },
        strengths: ["Brand"],
        weaknesses: ["Competition"],
        reasoning: "Strong fundamentals.",
        sources: [{ title: "Tesla IR", url: "https://ir.tesla.com" }],
      }),
      (prompt) => {
        assert(prompt.includes("Structured company context"), "Prompt missing context");
        assert(prompt.includes("companyScore"), "Prompt missing format instructions");
        promptChecked = true;
      }
    ),
  });

  assert(promptChecked, "Prompt was not executed");
  assert(result.companyScore === 8, "Parsed company score mismatch");

  await expectChainError(() =>
    analyzeCompany(companyResearchContext, {
      generateText: createMockGenerator(JSON.stringify({ companyScore: 99 })),
    })
  );

  printPass("test-company-chain");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
