// ============================================
// FinancialAnalysisCard — Financial Health & Metrics
// AI Investment Research Agent
// ============================================

import React from "react";
import type { FinancialAnalysis } from "@/types/agents.types";
import { Card, CardHeader, CardContent, Badge, ScoreBar } from "@/components/ui";

interface FinancialAnalysisCardProps {
  analysis: FinancialAnalysis;
}

export default function FinancialAnalysisCard({
  analysis,
}: FinancialAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center text-sm">
          💰
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Financial Analysis
            </h3>
            <Badge variant="success" size="sm">
              {analysis.score}/10
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Revenue, profitability & financial health
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Score Bar */}
        <ScoreBar label="Financial Score" value={analysis.score} />

        {/* Key Financials Grid */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Key Financials
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(analysis.keyFinancials).map(([key, value]) => (
              <div
                key={key}
                className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <p className="text-[10px] text-slate-500 uppercase">{key}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Growth */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Revenue Growth
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.revenueGrowth}
          </p>
        </div>

        {/* Profitability */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Profitability
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            {analysis.profitability}
          </p>
        </div>

        {/* Financial Health */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Financial Health
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            {analysis.financialHealth}
          </p>
        </div>

        {/* Growth Indicators */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Growth Indicators
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            {analysis.growthIndicators}
          </p>
        </div>

        {/* Reasoning */}
        <div className="pt-3 border-t border-white/[0.06]">
          <p className="text-xs text-slate-500 italic leading-relaxed">
            💡 {analysis.reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
