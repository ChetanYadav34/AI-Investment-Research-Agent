// ============================================
// Gauge Component — Circular Score Display
// AI Investment Research Agent
// ============================================

import React from "react";

interface GaugeProps {
  /** Value to display (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Label below the value */
  label?: string;
  /** Color scheme */
  colorScheme?: "auto" | "blue" | "green" | "red" | "amber";
  /** Optional CSS classes */
  className?: string;
}

function getAutoColor(percentage: number): string {
  if (percentage >= 70) return "stroke-emerald-400";
  if (percentage >= 50) return "stroke-amber-400";
  return "stroke-red-400";
}

function getAutoTextColor(percentage: number): string {
  if (percentage >= 70) return "text-emerald-400";
  if (percentage >= 50) return "text-amber-400";
  return "text-red-400";
}

const colorMap: Record<string, { stroke: string; text: string }> = {
  blue: { stroke: "stroke-blue-400", text: "text-blue-400" },
  green: { stroke: "stroke-emerald-400", text: "text-emerald-400" },
  red: { stroke: "stroke-red-400", text: "text-red-400" },
  amber: { stroke: "stroke-amber-400", text: "text-amber-400" },
};

export default function Gauge({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  colorScheme = "auto",
  className = "",
}: GaugeProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const strokeColor =
    colorScheme === "auto"
      ? getAutoColor(percentage)
      : colorMap[colorScheme]?.stroke || "stroke-blue-400";

  const textColor =
    colorScheme === "auto"
      ? getAutoTextColor(percentage)
      : colorMap[colorScheme]?.text || "text-blue-400";

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/[0.06]"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`${strokeColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${textColor}`}>
            {Math.round(value)}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
