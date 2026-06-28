// ============================================
// LangChain Tool Output Type Definitions
// AI Investment Research Agent
// ============================================

import type { Source } from "./agents.types";

export interface CompanyResearchContext {
  overview: string;
  businessModel: string;
  productsAndServices: string[];
  competitors: string[];
  marketPosition: string;
  keyStrengths: string[];
  keyChallenges: string[];
  sources: Source[];
}

export interface FinancialResearchContext {
  revenueProfile: string;
  profitabilityProfile: string;
  balanceSheetProfile: string;
  growthSignals: string[];
  valuationSignals: string[];
  keyFinancials: Record<string, string>;
  sources: Source[];
}

export interface NewsResearchContext {
  recentDevelopments: string[];
  positiveSignals: string[];
  negativeSignals: string[];
  sentimentSummary: string;
  notableCatalysts: string[];
  sources: Source[];
}
