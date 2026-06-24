// ============================================
// Loading Spinner Component — Reusable UI Primitive
// AI Investment Research Agent
// ============================================

import React from "react";

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional label below the spinner */
  label?: string;
  /** Optional CSS classes */
  className?: string;
}

const sizeMap: Record<string, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export default function LoadingSpinner({
  size = "md",
  label,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={`
            ${sizeMap[size]}
            rounded-full
            border-2 border-blue-500/20
          `}
        />
        {/* Spinning arc */}
        <div
          className={`
            absolute inset-0
            ${sizeMap[size]}
            rounded-full
            border-2 border-transparent border-t-blue-500
            animate-spin
          `}
        />
        {/* Inner pulse dot */}
        <div
          className="
            absolute inset-0
            flex items-center justify-center
          "
        >
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        </div>
      </div>
      {label && (
        <p className="text-sm text-slate-400 animate-pulse">{label}</p>
      )}
    </div>
  );
}
