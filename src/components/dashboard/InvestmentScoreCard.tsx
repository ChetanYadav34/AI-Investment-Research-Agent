// ============================================
// InvestmentScoreCard — Score Breakdown Display
// AI Investment Research Agent
// ============================================

import React from "react";
import type { InvestmentRecommendation } from "@/types/agents.types";
import { Card, CardHeader, CardContent, ScoreBar } from "@/components/ui";

interface InvestmentScoreCardProps {
  recommendation: InvestmentRecommendation;
}

export default function InvestmentScoreCard({
  recommendation,
}: InvestmentScoreCardProps) {
  const { scores } = recommendation;

  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Score Breakdown</h3>
          <p className="text-xs text-slate-500">Weighted 4-factor analysis</p>
        </div>
      </CardHeader>

      <CardContent>
        <ScoreBar label="Company (25%)" value={scores.company} />
        <ScoreBar label="Financial (35%)" value={scores.financial} />
        <ScoreBar label="News (20%)" value={scores.news} />
        <ScoreBar label="Risk (20%)" value={10 - scores.risk} />

        {/* Formula Display */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              (F×35 + C×25 + N×20 + (10−R)×20) / 10
            </span>
            <span className="text-lg font-bold text-slate-200">
              {scores.overall}
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
