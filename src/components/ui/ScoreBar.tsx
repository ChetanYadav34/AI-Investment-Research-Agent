// ============================================
// ScoreBar Component — Horizontal Score Display
// AI Investment Research Agent
// ============================================

import React from "react";

interface ScoreBarProps {
  /** Label for the score */
  label: string;
  /** Score value */
  value: number;
  /** Maximum value */
  max?: number;
  /** Show numeric value */
  showValue?: boolean;
  /** Optional CSS classes */
  className?: string;
}

function getBarColor(percentage: number): string {
  if (percentage >= 70) return "from-emerald-500 to-emerald-400";
  if (percentage >= 50) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

export default function ScoreBar({
  label,
  value,
  max = 10,
  showValue = true,
  className = "",
}: ScoreBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        {showValue && (
          <span className="text-sm font-semibold text-slate-200">
            {value}/{max}
          </span>
        )}
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getBarColor(percentage)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
