// ============================================
// ConfidenceCard — Confidence Gauge Display
// AI Investment Research Agent
// ============================================

import React from "react";
import type { InvestmentRecommendation } from "@/types/agents.types";
import { Card, CardHeader, Gauge } from "@/components/ui";

interface ConfidenceCardProps {
  recommendation: InvestmentRecommendation;
}

export default function ConfidenceCard({
  recommendation,
}: ConfidenceCardProps) {
  const { confidence, reasoning } = recommendation;

  const getConfidenceLabel = (c: number): string => {
    if (c >= 90) return "Very High";
    if (c >= 75) return "High";
    if (c >= 60) return "Moderate";
    if (c >= 40) return "Low";
    return "Very Low";
  };

  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Analysis Confidence
          </h3>
          <p className="text-xs text-slate-500">
            {getConfidenceLabel(confidence)} confidence
          </p>
        </div>
      </CardHeader>

      <div className="flex flex-col items-center py-2">
        <Gauge
          value={confidence}
          max={100}
          size={140}
          strokeWidth={10}
          colorScheme="blue"
        />
        <p className="text-xs text-slate-500 mt-4 leading-relaxed text-center line-clamp-3">
          {reasoning.slice(0, 200)}...
        </p>
      </div>
    </Card>
  );
}
