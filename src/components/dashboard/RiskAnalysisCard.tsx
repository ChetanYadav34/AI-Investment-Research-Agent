// ============================================
// RiskAnalysisCard — Risk Assessment
// AI Investment Research Agent
// ============================================

import React from "react";
import type { RiskAnalysis } from "@/types/agents.types";
import { Card, CardHeader, CardContent, Badge } from "@/components/ui";

interface RiskAnalysisCardProps {
  analysis: RiskAnalysis;
}

export default function RiskAnalysisCard({
  analysis,
}: RiskAnalysisCardProps) {
  const riskCategories = [
    { label: "Regulatory Risks", items: analysis.regulatoryRisks, icon: "⚖️" },
    { label: "Competition Risks", items: analysis.competitionRisks, icon: "🏁" },
    { label: "Industry Risks", items: analysis.industryRisks, icon: "🏭" },
    { label: "Execution Risks", items: analysis.executionRisks, icon: "⚙️" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-sm">
          ⚠️
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">
              Risk Analysis
            </h3>
            <Badge
              variant={
                analysis.overallRiskLevel === "Low"
                  ? "success"
                  : analysis.overallRiskLevel === "Medium"
                    ? "warning"
                    : "danger"
              }
              size="sm"
            >
              {analysis.overallRiskLevel} Risk
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Regulatory, competition, industry & execution risks
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {/* Score Bar (inverted — higher score = more risk) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-400">Risk Level</span>
            <span className="text-sm font-semibold text-slate-200">
              {analysis.score}/10
            </span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                analysis.score <= 3
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : analysis.score <= 6
                    ? "bg-gradient-to-r from-amber-500 to-amber-400"
                    : "bg-gradient-to-r from-red-500 to-red-400"
              }`}
              style={{ width: `${(analysis.score / 10) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-600 mt-1">
            Higher = More Risk · Score is inverted in final calculation
          </p>
        </div>

        {/* Risk Categories */}
        {riskCategories.map((category) => (
          <div key={category.label} className="mt-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>{category.icon}</span>
              {category.label}
            </h4>
            <ul className="space-y-1.5">
              {category.items.map((item, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-400 flex items-start gap-2"
                >
                  <span className="text-orange-500 mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

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
