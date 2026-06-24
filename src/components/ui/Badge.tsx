// ============================================
// Badge Component — Reusable UI Primitive
// AI Investment Research Agent
// ============================================

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  /** Visual variant */
  variant?: "default" | "success" | "warning" | "danger" | "info";
  /** Size of the badge */
  size?: "sm" | "md";
  /** Optional CSS classes */
  className?: string;
  /** Optional dot indicator */
  dot?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const dotStyles: Record<string, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-blue-400",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium
        border rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
