// ============================================
// ProsConsCard — Investment Pros & Cons
// AI Investment Research Agent
// ============================================

import React from "react";
import type { InvestmentRecommendation } from "@/types/agents.types";
import { Card, CardHeader, CardContent } from "@/components/ui";

interface ProsConsCardProps {
  recommendation: InvestmentRecommendation;
}

export default function ProsConsCard({
  recommendation,
}: ProsConsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Pros & Cons
          </h3>
          <p className="text-xs text-slate-500">
            Key investment arguments
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pros */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Investment Pros
              </h4>
            </div>
            <ul className="space-y-2">
              {recommendation.pros.map((pro, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                Investment Cons
              </h4>
            </div>
            <ul className="space-y-2">
              {recommendation.cons.map((con, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-[10px] font-bold text-red-400 shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
