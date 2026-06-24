// ============================================
// Card Component — Reusable UI Primitive
// AI Investment Research Agent
// ============================================

import React from "react";

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional CSS classes */
  className?: string;
  /** Adds a subtle glow effect */
  glow?: boolean;
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  glow = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`
        relative
        bg-slate-900/80 backdrop-blur-sm
        border border-white/[0.06]
        rounded-2xl
        transition-all duration-300
        hover:border-white/[0.1]
        ${glow ? "shadow-lg shadow-blue-500/5" : ""}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div
      className={`
        flex items-center gap-3
        pb-4 mb-4
        border-b border-white/[0.06]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}
