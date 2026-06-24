// ============================================
// LangGraph State Type Definitions
// AI Investment Research Agent
// ============================================

import type {
  CompanyContext,
  CompanyAnalysis,
  FinancialAnalysis,
  NewsAnalysis,
  RiskAnalysis,
  InvestmentRecommendation,
} from "./agents.types";

/**
 * Error captured during agent execution.
 * Supports graceful degradation — failed agents don't crash the pipeline.
 */
export interface AgentError {
  agent: string;
  message: string;
  timestamp: string;
}

/**
 * Workflow execution status.
 */
export type WorkflowStatus = "idle" | "running" | "completed" | "error";

/**
 * Core state that flows through every node in the LangGraph StateGraph.
 * Each agent reads from and writes to this shared state.
 */
export interface ResearchState {
  // ── Input ──
  companyName: string;

  // ── Coordinator Output ──
  companyContext: CompanyContext | null;

  // ── Agent Outputs ──
  companyAnalysis: CompanyAnalysis | null;
  financialAnalysis: FinancialAnalysis | null;
  newsAnalysis: NewsAnalysis | null;
  riskAnalysis: RiskAnalysis | null;

  // ── Final Output ──
  recommendation: InvestmentRecommendation | null;

  // ── Metadata ──
  status: WorkflowStatus;
  errors: AgentError[];
}

/**
 * Factory function to create initial research state.
 */
export function createInitialState(companyName: string): ResearchState {
  return {
    companyName,
    companyContext: null,
    companyAnalysis: null,
    financialAnalysis: null,
    newsAnalysis: null,
    riskAnalysis: null,
    recommendation: null,
    status: "idle",
    errors: [],
  };
}
