// ============================================
// RecommendationCard — INVEST or PASS Hero Card
// AI Investment Research Agent
// ============================================

import React from "react";
import type { InvestmentRecommendation } from "@/types/agents.types";
import { Card } from "@/components/ui";

interface RecommendationCardProps {
  recommendation: InvestmentRecommendation;
  companyName: string;
}

export default function RecommendationCard({
  recommendation,
  companyName,
}: RecommendationCardProps) {
  const isInvest = recommendation.recommendation === "INVEST";

  return (
    <Card padding="none" className="overflow-hidden col-span-full">
      {/* Gradient top border */}
      <div
        className={`h-1 ${
          isInvest
            ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400"
            : "bg-gradient-to-r from-red-500 via-red-400 to-orange-400"
        }`}
      />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Left: Recommendation */}
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">
              Investment Recommendation
            </p>
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`
                  text-4xl sm:text-5xl font-black tracking-tight
                  ${isInvest ? "text-emerald-400" : "text-red-400"}
                `}
              >
                {recommendation.recommendation}
              </span>
              <div
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold border
                  ${
                    isInvest
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }
                `}
              >
                {companyName}
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              {recommendation.summary}
            </p>
          </div>

          {/* Right: Scores Summary */}
          <div className="flex gap-6 sm:gap-8 shrink-0">
            {/* Investment Score */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg width="80" height="80" className="-rotate-90 transform">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-white/[0.06]"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={
                      2 * Math.PI * 34 -
                      (recommendation.investmentScore / 100) * 2 * Math.PI * 34
                    }
                    className={`${
                      isInvest ? "stroke-emerald-400" : "stroke-red-400"
                    } transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-xl font-bold ${
                      isInvest ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {recommendation.investmentScore}
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Score
              </p>
            </div>

            {/* Confidence */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg width="80" height="80" className="-rotate-90 transform">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-white/[0.06]"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={
                      2 * Math.PI * 34 -
                      (recommendation.confidence / 100) * 2 * Math.PI * 34
                    }
                    className="stroke-blue-400 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-400">
                    {recommendation.confidence}%
                  </span>
                </div>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Confidence
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
