// ============================================
// DashboardGrid — Layout for All Analysis Cards
// AI Investment Research Agent
// ============================================

import React from "react";
import type { ResearchState } from "@/types/graph.types";
import RecommendationCard from "./RecommendationCard";
import InvestmentScoreCard from "./InvestmentScoreCard";
import ConfidenceCard from "./ConfidenceCard";
import CompanyAnalysisCard from "./CompanyAnalysisCard";
import FinancialAnalysisCard from "./FinancialAnalysisCard";
import NewsAnalysisCard from "./NewsAnalysisCard";
import RiskAnalysisCard from "./RiskAnalysisCard";
import ProsConsCard from "./ProsConsCard";
import SourcesCard from "./SourcesCard";

interface DashboardGridProps {
  data: ResearchState;
}

export default function DashboardGrid({ data }: DashboardGridProps) {
  const {
    companyContext,
    companyAnalysis,
    financialAnalysis,
    newsAnalysis,
    riskAnalysis,
    recommendation,
  } = data;

  // Guard: need recommendation at minimum
  if (!recommendation) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Research Report
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Multi-agent analysis for{" "}
            <span className="text-slate-300 font-medium">
              {companyContext?.companyName || data.companyName}
            </span>
            {companyContext?.ticker && (
              <span className="text-slate-500">
                {" "}
                · {companyContext.ticker} · {companyContext.exchange}
              </span>
            )}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ Analysis Complete
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="space-y-4">
        {/* Row 1: Recommendation (full width) */}
        <RecommendationCard
          recommendation={recommendation}
          companyName={companyContext?.companyName || data.companyName}
        />

        {/* Row 2: Score Breakdown + Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InvestmentScoreCard recommendation={recommendation} />
          <ConfidenceCard recommendation={recommendation} />
        </div>

        {/* Row 3: Pros & Cons (full width) */}
        <ProsConsCard recommendation={recommendation} />

        {/* Row 4: Company + Financial Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {companyAnalysis && companyContext && (
            <CompanyAnalysisCard
              analysis={companyAnalysis}
              context={companyContext}
            />
          )}
          {financialAnalysis && (
            <FinancialAnalysisCard analysis={financialAnalysis} />
          )}
        </div>

        {/* Row 5: News + Risk Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {newsAnalysis && <NewsAnalysisCard analysis={newsAnalysis} />}
          {riskAnalysis && <RiskAnalysisCard analysis={riskAnalysis} />}
        </div>

        {/* Row 6: Sources */}
        {recommendation.sourcesCited.length > 0 && (
          <SourcesCard sources={recommendation.sourcesCited} />
        )}
      </div>
    </div>
  );
}
