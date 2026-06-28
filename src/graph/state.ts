// ============================================
// LangGraph State Definition
// AI Investment Research Agent
// ============================================

import { Annotation } from "@langchain/langgraph";
import type {
  CompanyContext,
  CompanyAnalysis,
  FinancialAnalysis,
  NewsAnalysis,
  RiskAnalysis,
  InvestmentRecommendation,
} from "@/types/agents.types";
import type {
  CompanyResearchContext,
  FinancialResearchContext,
  NewsResearchContext,
} from "@/types/tools.types";

/**
 * Execution Status of the overall graph.
 */
export type GraphStatus = "IDLE" | "RUNNING" | "COMPLETED" | "FAILED";

/**
 * Defines the state structure maintained throughout the LangGraph execution.
 * We use `Annotation.Root` to provide strict typing and default Reducers.
 */
export const GraphState = Annotation.Root({
  // Input parameter
  companyName: Annotation<string>({
    reducer: (curr, next) => next || curr,
    default: () => "",
  }),

  // Extracted Contexts
  companyContext: Annotation<CompanyContext | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),
  companyResearchContext: Annotation<CompanyResearchContext | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),
  financialResearchContext: Annotation<FinancialResearchContext | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),
  newsResearchContext: Annotation<NewsResearchContext | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),

  // Specialist Analyses
  companyAnalysis: Annotation<CompanyAnalysis | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),
  financialAnalysis: Annotation<FinancialAnalysis | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),
  newsAnalysis: Annotation<NewsAnalysis | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),
  riskAnalysis: Annotation<RiskAnalysis | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),

  // Final Output
  finalRecommendation: Annotation<InvestmentRecommendation | null>({
    reducer: (curr, next) => next || curr,
    default: () => null,
  }),

  // Orchestration & Metadata
  executionStatus: Annotation<GraphStatus>({
    reducer: (curr, next) => next || curr,
    default: () => "IDLE",
  }),
  errors: Annotation<string[]>({
    reducer: (curr, next) => [...curr, ...next],
    default: () => [],
  }),
});
