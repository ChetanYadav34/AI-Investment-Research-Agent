// ============================================
// API Client
// AI Investment Research Agent
// ============================================

import type { ResearchState } from "@/types/graph.types";

export interface ResearchApiResponse extends Omit<ResearchState, 'status'> {
  success: boolean;
  executionTime?: number;
}

export async function runResearchAnalysis(companyName: string): Promise<ResearchApiResponse> {
  const response = await fetch("/api/research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companyName }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.errors?.[0] || "An unknown error occurred during analysis.";
    throw new Error(errorMsg);
  }

  // The API returns the data mapping exactly to our ResearchState shape
  return data as ResearchApiResponse;
}
