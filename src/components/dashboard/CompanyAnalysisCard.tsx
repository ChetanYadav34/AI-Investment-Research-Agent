// ============================================
// CompanyAnalysisCard — Business Fundamentals
// AI Investment Research Agent
// ============================================

import React from "react";
import type { CompanyAnalysis, CompanyContext } from "@/types/agents.types";
import { Card, CardHeader, CardContent, Badge, ScoreBar } from "@/components/ui";

interface CompanyAnalysisCardProps {
  analysis: CompanyAnalysis;
  context: CompanyContext;
}

export default function CompanyAnalysisCard({
  analysis,
  context,
}: CompanyAnalysisCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-sm">
          🏢
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Company Analysis
            </h3>
            <Badge variant="info" size="sm">
              {analysis.companyScore}/10
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {context.ticker && `${context.ticker} · `}
            {context.industry}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Score Bar */}
        <ScoreBar label="Company Score" value={analysis.companyScore} />

        {/* Overview */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Overview
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.overview}
          </p>
        </div>

        {/* Business Model */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Business Model
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            {analysis.businessModel}
          </p>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Products & Services
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.productsAndServices.map((product) => (
              <span
                key={product}
                className="px-2 py-1 text-xs rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.06]"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(analysis.keyMetrics).map(([key, value]) => (
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

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>↑</span> Strengths
            </h4>
            <ul className="space-y-1.5">
              {analysis.strengths.map((s, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-400 flex items-start gap-2"
                >
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>↓</span> Weaknesses
            </h4>
            <ul className="space-y-1.5">
              {analysis.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-400 flex items-start gap-2"
                >
                  <span className="text-red-500 mt-0.5 shrink-0">•</span>
                  {w}
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
