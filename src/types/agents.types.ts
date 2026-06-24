// ============================================
// Agent Output Type Definitions
// AI Investment Research Agent
// ============================================

/**
 * Source citation returned by every analysis agent.
 * Enables explainability and transparency.
 */
export interface Source {
  title: string;
  url: string;
}

/**
 * Lightweight context extracted by the Research Coordinator.
 * Resolves company name → structured identifiers.
 */
export interface CompanyContext {
  companyName: string;
  ticker: string | null;
  industry: string;
  sector: string;
  exchange: string | null;
  description: string;
}

/**
 * Output of the Company Research Agent.
 * Evaluates business quality, market position, and competitive moat.
 */
export interface CompanyAnalysis {
  companyScore: number; // 1-10
  overview: string;
  businessModel: string;
  productsAndServices: string[];
  industryPosition: string;
  competitiveAdvantage: string;
  keyMetrics: Record<string, string>;
  strengths: string[];
  weaknesses: string[];
  reasoning: string;
  sources: Source[];
}

/**
 * Output of the Financial Analysis Agent.
 * Evaluates financial health, growth, and investment attractiveness.
 */
export interface FinancialAnalysis {
  score: number; // 1-10
  revenueGrowth: string;
  profitability: string;
  financialHealth: string;
  growthIndicators: string;
  investmentAttractiveness: string;
  reasoning: string;
  keyFinancials: Record<string, string>;
  sources: Source[];
}

/**
 * Output of the News Analysis Agent.
 * Evaluates recent developments and market sentiment.
 */
export interface NewsAnalysis {
  score: number; // 1-10
  recentDevelopments: string[];
  positiveCatalysts: string[];
  negativeCatalysts: string[];
  marketSentiment: "Bullish" | "Bearish" | "Neutral" | "Mixed";
  reasoning: string;
  sources: Source[];
}

/**
 * Output of the Risk Analysis Agent.
 * Evaluates regulatory, competition, industry, and execution risks.
 */
export interface RiskAnalysis {
  score: number; // 1-10 (higher = riskier)
  regulatoryRisks: string[];
  competitionRisks: string[];
  industryRisks: string[];
  executionRisks: string[];
  overallRiskLevel: "Low" | "Medium" | "High" | "Critical";
  reasoning: string;
  sources: Source[];
}

/**
 * Final output of the Investment Committee Agent.
 * Synthesizes all analyses into a recommendation.
 */
export interface InvestmentRecommendation {
  recommendation: "INVEST" | "PASS";
  investmentScore: number; // 0-100
  confidence: number; // 0-100
  reasoning: string;
  pros: string[];
  cons: string[];
  summary: string;
  scores: {
    company: number;
    financial: number;
    news: number;
    risk: number;
    overall: number;
  };
  sourcesCited: Source[];
}
