import { analyzeNews } from "../src/chains";
import { newsResearchContext } from "./chain-test-fixtures";
import {
  assert,
  createMockGenerator,
  expectChainError,
  printPass,
} from "./chain-test-utils";

async function main(): Promise<void> {
  let promptChecked = false;

  const result = await analyzeNews(newsResearchContext, {
    generateText: createMockGenerator(
      JSON.stringify({
        score: 7,
        recentDevelopments: ["Energy storage growth"],
        positiveCatalysts: ["Charging monetization"],
        negativeCatalysts: ["EV price pressure"],
        marketSentiment: "Mixed",
        reasoning: "Balanced sentiment.",
        sources: [{ title: "Reuters", url: "https://reuters.com" }],
      }),
      (prompt) => {
        assert(prompt.includes("Structured news context"), "Prompt missing context");
        assert(prompt.includes("marketSentiment"), "Prompt missing format instructions");
        promptChecked = true;
      }
    ),
  });

  assert(promptChecked, "Prompt was not executed");
  assert(result.marketSentiment === "Mixed", "Parsed sentiment mismatch");

  await expectChainError(() =>
    analyzeNews(newsResearchContext, {
      generateText: createMockGenerator(JSON.stringify({ score: 7 })),
    })
  );

  printPass("test-news-chain");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
