import type {
  CompanyAnalysis,
  CompanyContext,
  FinancialAnalysis,
  NewsAnalysis,
  RiskAnalysis,
} from "../src/types/agents.types";
import type {
  CompanyResearchContext,
  FinancialResearchContext,
  NewsResearchContext,
} from "../src/types/tools.types";

export const companyContext: CompanyContext = {
  companyName: "Tesla, Inc.",
  ticker: "TSLA",
  industry: "Electric Vehicles",
  sector: "Consumer Discretionary",
  exchange: "NASDAQ",
  description: "Electric vehicle and clean energy company.",
};

export const companyResearchContext: CompanyResearchContext = {
  overview: "Tesla is a leading EV and clean energy company.",
  businessModel: "Vehicle sales, software, charging, and energy storage.",
  productsAndServices: ["Model 3", "Model Y", "Megapack"],
  competitors: ["BYD", "Volkswagen", "Hyundai"],
  marketPosition: "Global EV leader with strong brand recognition.",
  keyStrengths: ["Brand", "Charging network", "Software"],
  keyChallenges: ["Competition", "Margin pressure"],
  sources: [{ title: "Tesla IR", url: "https://ir.tesla.com" }],
};

export const financialResearchContext: FinancialResearchContext = {
  revenueProfile: "Automotive revenue remains the largest contributor.",
  profitabilityProfile: "Margins are positive but pressured by price cuts.",
  balanceSheetProfile: "Strong cash position and manageable debt.",
  growthSignals: ["Energy storage growth", "Software monetization"],
  valuationSignals: ["Premium multiple", "High growth expectations"],
  keyFinancials: {
    Revenue: "$96B",
    "Operating Margin": "8%",
  },
  sources: [{ title: "Tesla Financials", url: "https://ir.tesla.com" }],
};

export const newsResearchContext: NewsResearchContext = {
  recentDevelopments: ["Energy storage deployments increased."],
  positiveSignals: ["Charging network monetization"],
  negativeSignals: ["EV price competition"],
  sentimentSummary: "Mixed to bullish sentiment.",
  notableCatalysts: ["Energy growth", "Autonomy progress"],
  sources: [{ title: "Reuters", url: "https://reuters.com" }],
};

export const companyAnalysis: CompanyAnalysis = {
  companyScore: 8,
  overview: "Tesla has a strong EV and energy platform.",
  businessModel: "Tesla sells vehicles, software, charging, and energy products.",
  productsAndServices: ["Model 3", "Model Y", "Megapack"],
  industryPosition: "Leader in EVs with strong brand visibility.",
  competitiveAdvantage: "Brand, charging network, and vertical integration.",
  keyMetrics: { Brand: "Global" },
  strengths: ["Brand", "Software"],
  weaknesses: ["Competition"],
  reasoning: "Strong position but rising competition.",
  sources: [{ title: "Tesla IR", url: "https://ir.tesla.com" }],
};

export const financialAnalysis: FinancialAnalysis = {
  score: 7,
  revenueGrowth: "Revenue growth is positive but moderating.",
  profitability: "Margins are profitable but pressured.",
  financialHealth: "Balance sheet is strong.",
  growthIndicators: "Energy storage and software are growth drivers.",
  investmentAttractiveness: "Premium valuation requires execution.",
  reasoning: "Healthy financials with valuation risk.",
  keyFinancials: { Revenue: "$96B" },
  sources: [{ title: "Tesla Financials", url: "https://ir.tesla.com" }],
};

export const newsAnalysis: NewsAnalysis = {
  score: 7,
  recentDevelopments: ["Energy business growth"],
  positiveCatalysts: ["Charging revenue"],
  negativeCatalysts: ["Price competition"],
  marketSentiment: "Mixed",
  reasoning: "Balanced news context.",
  sources: [{ title: "Reuters", url: "https://reuters.com" }],
};

export const riskAnalysis: RiskAnalysis = {
  score: 5,
  regulatoryRisks: ["Autonomy approval uncertainty"],
  competitionRisks: ["BYD and legacy OEMs"],
  industryRisks: ["EV adoption volatility"],
  executionRisks: ["Manufacturing and product timing"],
  overallRiskLevel: "Medium",
  reasoning: "Risks are material but manageable.",
  sources: [{ title: "S&P Global", url: "https://spglobal.com" }],
};
