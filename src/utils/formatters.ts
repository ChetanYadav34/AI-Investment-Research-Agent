// ============================================
// Data Formatting Utilities
// AI Investment Research Agent
// ============================================

/**
 * Formats a score (1-10) as a percentage string.
 */
export function formatScoreAsPercent(score: number, max: number = 10): string {
  return `${Math.round((score / max) * 100)}%`;
}

/**
 * Returns a color class based on score value.
 */
export function getScoreColor(score: number, max: number = 10): string {
  const percentage = (score / max) * 100;
  if (percentage >= 70) return "text-emerald-400";
  if (percentage >= 50) return "text-amber-400";
  return "text-red-400";
}

/**
 * Returns a background color class based on score value.
 */
export function getScoreBgColor(score: number, max: number = 10): string {
  const percentage = (score / max) * 100;
  if (percentage >= 70) return "bg-emerald-400/20";
  if (percentage >= 50) return "bg-amber-400/20";
  return "bg-red-400/20";
}

/**
 * Formats the recommendation as a styled label.
 */
export function getRecommendationStyle(recommendation: "INVEST" | "PASS"): {
  color: string;
  bgColor: string;
  label: string;
} {
  if (recommendation === "INVEST") {
    return {
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10 border-emerald-400/30",
      label: "INVEST",
    };
  }
  return {
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/30",
    label: "PASS",
  };
}

/**
 * Formats a sentiment value with appropriate styling.
 */
export function getSentimentStyle(sentiment: string): {
  color: string;
  icon: string;
} {
  switch (sentiment) {
    case "Bullish":
      return { color: "text-emerald-400", icon: "↑" };
    case "Bearish":
      return { color: "text-red-400", icon: "↓" };
    case "Mixed":
      return { color: "text-amber-400", icon: "↕" };
    default:
      return { color: "text-slate-400", icon: "→" };
  }
}

/**
 * Returns the risk level badge style.
 */
export function getRiskLevelStyle(level: string): {
  color: string;
  bgColor: string;
} {
  switch (level) {
    case "Low":
      return { color: "text-emerald-400", bgColor: "bg-emerald-400/10" };
    case "Medium":
      return { color: "text-amber-400", bgColor: "bg-amber-400/10" };
    case "High":
      return { color: "text-orange-400", bgColor: "bg-orange-400/10" };
    case "Critical":
      return { color: "text-red-400", bgColor: "bg-red-400/10" };
    default:
      return { color: "text-slate-400", bgColor: "bg-slate-400/10" };
  }
}
