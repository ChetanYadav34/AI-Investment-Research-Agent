// ============================================
// Mock Data — Realistic Tesla Investment Report
// AI Investment Research Agent
// ============================================
// This file provides hardcoded mock data for UI development.
// No API calls. No Gemini. No backend. Pure frontend mock.
// Will be replaced by real LangGraph output in Phase 9.

import type {
  CompanyContext,
  CompanyAnalysis,
  FinancialAnalysis,
  NewsAnalysis,
  RiskAnalysis,
  InvestmentRecommendation,
} from "@/types/agents.types";
import type { ResearchState } from "@/types/graph.types";

// ── Company Context ──
export const mockCompanyContext: CompanyContext = {
  companyName: "Tesla, Inc.",
  ticker: "TSLA",
  industry: "Electric Vehicles & Clean Energy",
  sector: "Consumer Discretionary",
  exchange: "NASDAQ",
  description:
    "Tesla designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems. The company operates through Automotive and Energy Generation and Storage segments.",
};

// ── Company Analysis ──
export const mockCompanyAnalysis: CompanyAnalysis = {
  companyScore: 8,
  overview:
    "Tesla is the global leader in battery electric vehicles (BEVs), commanding approximately 20% of the worldwide EV market. The company has successfully expanded beyond automotive into energy storage, solar, and AI-driven autonomous driving technology.",
  businessModel:
    "Direct-to-consumer sales model bypassing traditional dealerships, vertically integrated manufacturing with Gigafactories, recurring software revenue through Full Self-Driving (FSD) subscriptions, and growing energy storage deployment.",
  productsAndServices: [
    "Model S / Model 3 / Model X / Model Y",
    "Cybertruck",
    "Tesla Semi",
    "Powerwall & Megapack (Energy Storage)",
    "Solar Roof & Solar Panels",
    "Full Self-Driving (FSD) Software",
    "Supercharger Network",
    "Dojo Supercomputer (AI Training)",
  ],
  industryPosition:
    "Tesla holds the #1 position in global BEV sales, though market share has declined from 25% to 20% as competition intensifies from BYD, Volkswagen Group, and Hyundai-Kia. The company maintains technological leadership in battery efficiency, autonomous driving, and manufacturing scale.",
  competitiveAdvantage:
    "Tesla's moat derives from its vertically integrated supply chain, proprietary Supercharger network (now an industry standard), advanced FSD neural network trained on billions of real-world miles, brand loyalty, and cost advantages from Gigafactory scale.",
  keyMetrics: {
    "Market Cap": "$785B",
    Employees: "140,000+",
    "Founded": "2003",
    "CEO": "Elon Musk",
    "Vehicles Delivered (2024)": "1.81M",
    "Supercharger Stations": "6,500+",
    "Countries of Operation": "45+",
  },
  strengths: [
    "Dominant EV brand with unmatched global recognition",
    "Vertically integrated manufacturing at Gigafactory scale",
    "Industry-leading battery technology and energy density",
    "Proprietary Supercharger network adopted as NACS standard",
    "Software-defined vehicles enabling OTA updates and recurring revenue",
    "Strong balance sheet with $29B+ cash reserves",
  ],
  weaknesses: [
    "Heavy reliance on Elon Musk's leadership and public persona",
    "Increasing competition from legacy automakers and Chinese EVs",
    "Quality control inconsistencies in early production runs",
    "Limited model lineup compared to traditional automakers",
    "FSD regulatory approval timeline remains uncertain",
    "Valuation premium requires sustained hypergrowth",
  ],
  reasoning:
    "Tesla scores 8/10 on company fundamentals due to its undeniable market leadership, technological moat, and successful diversification into energy storage. Points deducted for key-person risk (Elon Musk dependency) and mounting competitive pressure from BYD and others.",
  sources: [
    { title: "Tesla 2024 Annual Report (10-K)", url: "https://ir.tesla.com" },
    { title: "Global EV Sales Tracker - BloombergNEF", url: "https://about.bnef.com" },
    { title: "Tesla Investor Relations", url: "https://ir.tesla.com" },
  ],
};

// ── Financial Analysis ──
export const mockFinancialAnalysis: FinancialAnalysis = {
  score: 7,
  revenueGrowth:
    "Tesla reported $96.8B in total revenue for FY2024, representing 10% YoY growth. Automotive revenue grew 8%, while Energy Generation & Storage surged 67% to $10.4B, becoming an increasingly significant contributor.",
  profitability:
    "Operating margin contracted to 8.2% from 11.4% in FY2023 due to aggressive price cuts across all models. GAAP net income was $7.1B. Free cash flow remained positive at $3.6B despite heavy CapEx in Gigafactory expansion.",
  financialHealth:
    "Tesla maintains a fortress balance sheet with $29.1B in cash and short-term investments against $5.7B in total debt. Current ratio of 1.84 indicates strong short-term liquidity. The company is investment-grade rated.",
  growthIndicators:
    "Energy storage deployments grew 125% YoY to 31.4 GWh. FSD subscription revenue is estimated at $1.5B annually. Cybertruck production ramped to 2,500 units/week. Megafactory in Shanghai will triple Megapack capacity by 2026.",
  investmentAttractiveness:
    "Tesla trades at a forward P/E of 58x, a significant premium to the auto sector average of 8x. However, this premium is partially justified by the energy storage growth trajectory, FSD monetization potential, and Optimus robot upside.",
  reasoning:
    "Score of 7/10 reflects strong revenue diversification into energy, a healthy balance sheet, and positive free cash flow. Deductions for margin compression from price wars and an elevated valuation multiple that prices in significant future execution.",
  keyFinancials: {
    "Revenue (FY2024)": "$96.8B",
    "Net Income": "$7.1B",
    "Operating Margin": "8.2%",
    "Free Cash Flow": "$3.6B",
    "Cash & Equivalents": "$29.1B",
    "Total Debt": "$5.7B",
    "Forward P/E": "58x",
    "EV/Revenue": "8.1x",
  },
  sources: [
    { title: "Tesla Q4 2024 Earnings Release", url: "https://ir.tesla.com" },
    { title: "SEC EDGAR - Tesla 10-K Filing", url: "https://sec.gov" },
    { title: "Yahoo Finance - TSLA", url: "https://finance.yahoo.com" },
  ],
};

// ── News Analysis ──
export const mockNewsAnalysis: NewsAnalysis = {
  score: 7,
  recentDevelopments: [
    "Tesla launches affordable Model Q targeting sub-$30K EV market segment",
    "FSD v13 achieves 5x safety improvement over human drivers in NHTSA data",
    "Megapack orders backlogged through 2027 with $12B+ pipeline",
    "Tesla Robotaxi service approved for limited deployment in Austin, TX",
    "Shanghai Megafactory begins Megapack production, tripling global capacity",
  ],
  positiveCatalysts: [
    "Robotaxi launch could unlock $5T+ autonomous mobility TAM",
    "Energy storage becoming second growth engine with 100%+ growth",
    "NACS adoption by Ford, GM, Rivian creates Supercharger network monetization",
    "Optimus humanoid robot prototype shows commercial viability",
    "Model Q at sub-$30K price point could double addressable market",
  ],
  negativeCatalysts: [
    "EU tariff increases on China-exported Tesla vehicles",
    "BYD outselling Tesla globally for 3 consecutive quarters",
    "Elon Musk's political involvement affecting brand perception in key markets",
    "FSD liability framework still undefined by NHTSA",
    "Margin pressure from ongoing price war with legacy automakers",
  ],
  marketSentiment: "Bullish",
  reasoning:
    "News sentiment scores 7/10 — predominantly positive catalysts around robotaxi approval, energy storage explosion, and Model Q launch. Negative factors (brand risk from Musk's politics, BYD competition, margin pressure) are real but largely priced in. Net sentiment is cautiously bullish.",
  sources: [
    { title: "Reuters - Tesla Robotaxi Approval", url: "https://reuters.com" },
    { title: "Bloomberg - Tesla Energy Storage", url: "https://bloomberg.com" },
    { title: "CNBC - Tesla Model Q Announcement", url: "https://cnbc.com" },
  ],
};

// ── Risk Analysis ──
export const mockRiskAnalysis: RiskAnalysis = {
  score: 5,
  regulatoryRisks: [
    "FSD regulatory framework remains undefined across most jurisdictions",
    "EU Carbon Border Adjustment Mechanism could affect supply chain costs",
    "Potential changes to US EV tax credit eligibility under new administration",
    "China data localization requirements for autonomous driving systems",
  ],
  competitionRisks: [
    "BYD surpassing Tesla in global EV units sold",
    "Legacy OEMs (VW, Hyundai, Toyota) accelerating EV transitions",
    "Chinese EVs entering European markets with 30-40% price advantage",
    "Apple and Xiaomi entering EV market with strong consumer ecosystems",
  ],
  industryRisks: [
    "Battery raw material price volatility (lithium, cobalt, nickel)",
    "Charging infrastructure standardization still evolving",
    "Consumer EV adoption plateau in some mature markets",
    "Interest rate sensitivity affecting vehicle financing",
  ],
  executionRisks: [
    "Key-person risk: extreme dependence on Elon Musk",
    "Cybertruck production ramp challenges and quality issues",
    "FSD timeline repeatedly delayed — credibility gap",
    "Managing 4 Gigafactories simultaneously across 3 continents",
  ],
  overallRiskLevel: "Medium",
  reasoning:
    "Risk score of 5/10 (moderate) reflects balanced risk profile. Regulatory uncertainty around FSD and intensifying competition from BYD are the top concerns. Mitigated by Tesla's financial strength, technological lead, and diversification into energy. Key-person risk (Musk) is the single largest idiosyncratic risk factor.",
  sources: [
    { title: "McKinsey - EV Market Outlook 2025", url: "https://mckinsey.com" },
    { title: "S&P Global - EV Competition Analysis", url: "https://spglobal.com" },
  ],
};

// ── Investment Recommendation ──
export const mockRecommendation: InvestmentRecommendation = {
  recommendation: "INVEST",
  investmentScore: 76,
  confidence: 83,
  reasoning:
    "Tesla earns an INVEST recommendation with a score of 76/100. The company's multi-pronged growth strategy — spanning EVs, energy storage, autonomous driving, and AI/robotics — positions it uniquely among both automakers and technology companies. While the premium valuation demands continued execution, the energy storage business alone justifies meaningful upside. Key risks (Musk dependency, BYD competition, FSD timeline) are material but manageable given Tesla's balance sheet strength and technological moat.",
  pros: [
    "Global EV market leader with 20% market share and iconic brand",
    "Energy storage business growing 100%+ YoY with massive backlog",
    "Proprietary Supercharger network becoming industry standard (NACS)",
    "FSD v13 approaching human-level safety with regulatory momentum",
    "$29B cash reserves provide strong financial flexibility",
    "Optimus robot and Dojo supercomputer represent asymmetric upside",
  ],
  cons: [
    "Forward P/E of 58x requires sustained hypergrowth execution",
    "BYD competition intensifying in both China and global markets",
    "Operating margins compressed from 11.4% to 8.2% due to price war",
    "Heavy reliance on Elon Musk creates key-person risk",
    "FSD regulatory timeline remains uncertain despite technical progress",
  ],
  summary:
    "Tesla represents a high-conviction investment opportunity at the intersection of automotive disruption, clean energy transformation, and AI/robotics. The company's diversification beyond vehicles into energy storage and autonomous mobility creates multiple growth vectors. We recommend INVEST with a 76/100 score and 83% confidence, acknowledging the elevated valuation and execution risks.",
  scores: {
    company: 8,
    financial: 7,
    news: 7,
    risk: 5,
    overall: 76,
  },
  sourcesCited: [
    { title: "Tesla 2024 Annual Report (10-K)", url: "https://ir.tesla.com" },
    { title: "Bloomberg - Tesla Energy Storage", url: "https://bloomberg.com" },
    { title: "Reuters - Tesla Robotaxi Approval", url: "https://reuters.com" },
    { title: "Global EV Sales Tracker - BloombergNEF", url: "https://about.bnef.com" },
    { title: "McKinsey - EV Market Outlook 2025", url: "https://mckinsey.com" },
  ],
};

// ── Complete Research State (for Dashboard) ──
export const mockResearchState: ResearchState = {
  companyName: "Tesla",
  companyContext: mockCompanyContext,
  companyAnalysis: mockCompanyAnalysis,
  financialAnalysis: mockFinancialAnalysis,
  newsAnalysis: mockNewsAnalysis,
  riskAnalysis: mockRiskAnalysis,
  recommendation: mockRecommendation,
  status: "completed",
  errors: [],
};
