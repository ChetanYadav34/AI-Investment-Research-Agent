// ============================================
// Base Prompts & Shared Instructions
// AI Investment Research Agent
// ============================================

export const JSON_RESPONSE_RULES = `
Return ONLY valid JSON. Do not use markdown. Do not wrap JSON in code fences. Follow the provided formatting instructions exactly.
Keep reasoning concise (1-2 sentences). Write short summaries. Do not repeat explanations. Do not include unnecessary explanations.
Limit sources to a maximum of 3 citations.
Use only the requested fields. If data is uncertain, state that clearly in short prose fields.
`;

export function buildResearchContext(companyName: string): string {
  return `Company to analyze: ${companyName}`;
}
