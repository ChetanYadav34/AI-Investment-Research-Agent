import { POST } from "../src/app/api/research/route";

async function run(company: string) {
  console.log(`\n==========================================\n`);
  console.log(`TESTING: ${company}`);
  const req = new Request("http://localhost/api/research", {
    method: "POST",
    body: JSON.stringify({ companyName: company }),
    headers: { "Content-Type": "application/json" },
  });

  const res = await POST(req);
  const data = await res.json();
  console.log(`Status: ${res.status}`);
  console.log(`Success: ${data.success}`);
  if (!data.success) {
    console.error("Errors:", data.errors);
  } else {
    console.log("Recommendation:", data.data.finalRecommendation.recommendation);
    console.log("Score Breakdown:", data.data.finalRecommendation.scoreBreakdown);
  }
}

async function main() {
  await run("Tesla");
  await run("Apple");
  await run("Microsoft");
}

main().catch(console.error);
