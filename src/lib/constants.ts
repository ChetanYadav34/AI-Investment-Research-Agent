// ============================================
// Application Constants
// AI Investment Research Agent
// ============================================

export const APP_CONFIG = {
  name: "AI Investment Research Agent",
  description:
    "Multi-agent AI system for comprehensive investment research and analysis",
  version: "1.0.0",
} as const;

/**
 * Scoring weights for the Investment Score formula.
 * Financial (35%) + Company (25%) + News (20%) + Risk-inverted (20%) = 100%
 */
export const SCORE_WEIGHTS = {
  financial: 0.35,
  company: 0.25,
  news: 0.2,
  risk: 0.2,
} as const;

/**
 * Decision thresholds for INVEST vs PASS.
 */
export const DECISION_THRESHOLDS = {
  invest: 70,
  pass: 50,
} as const;

/**
 * Agent identifiers used in logging and progress tracking.
 */
export const AGENT_NAMES = {
  coordinator: "Research Coordinator",
  company: "Company Research Agent",
  finance: "Financial Analysis Agent",
  news: "News Analysis Agent",
  risk: "Risk Analysis Agent",
  committee: "Investment Committee",
} as const;

/**
 * API configuration.
 */
export const API_CONFIG = {
  researchEndpoint: "/api/research",
  timeoutMs: 120_000,
} as const;
