// ============================================
// NewsAnalysisCard — News & Sentiment
// AI Investment Research Agent
// ============================================

import React from "react";
import type { NewsAnalysis } from "@/types/agents.types";
import { Card, CardHeader, CardContent, Badge, ScoreBar } from "@/components/ui";
import { getSentimentStyle } from "@/utils/formatters";

interface NewsAnalysisCardProps {
  analysis: NewsAnalysis;
}

export default function NewsAnalysisCard({
  analysis,
}: NewsAnalysisCardProps) {
  const sentiment = getSentimentStyle(analysis.marketSentiment);

  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center text-sm">
          📰
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              News Analysis
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  analysis.marketSentiment === "Bullish"
                    ? "success"
                    : analysis.marketSentiment === "Bearish"
                      ? "danger"
                      : "warning"
                }
                size="sm"
              >
                {sentiment.icon} {analysis.marketSentiment}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Recent developments & market sentiment
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Score Bar */}
        <ScoreBar label="News Score" value={analysis.score} />

        {/* Recent Developments */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Recent Developments
          </h4>
          <ul className="space-y-2">
            {analysis.recentDevelopments.map((dev, i) => (
              <li
                key={i}
                className="text-sm text-slate-300 flex items-start gap-2"
              >
                <span className="text-blue-400 mt-0.5 shrink-0 text-xs">▸</span>
                {dev}
              </li>
            ))}
          </ul>
        </div>

        {/* Catalysts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Positive */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>↑</span> Positive Catalysts
            </h4>
            <ul className="space-y-1.5">
              {analysis.positiveCatalysts.map((c, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-400 flex items-start gap-2"
                >
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Negative */}
          <div>
            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>↓</span> Negative Catalysts
            </h4>
            <ul className="space-y-1.5">
              {analysis.negativeCatalysts.map((c, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-400 flex items-start gap-2"
                >
                  <span className="text-red-500 mt-0.5 shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
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
