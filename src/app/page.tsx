// ============================================
// Homepage — Main Dashboard with Mock Data
// AI Investment Research Agent
// ============================================

"use client";

import React, { useState, useCallback } from "react";
import { Button, Card, Input, Badge } from "@/components/ui";
import { AnalysisLoading, DashboardGrid } from "@/components/dashboard";
import { runResearchAnalysis } from "@/lib/api-client";
import type { ResearchState } from "@/types/graph.types";

type AppStatus = "idle" | "loading" | "results";

export default function HomePage() {
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState<AppStatus>("idle");
  const [result, setResult] = useState<ResearchState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!companyName.trim()) return;

    // ── Start loading ──
    setStatus("loading");
    setResult(null);
    setError(null);

    try {
      const data = await runResearchAnalysis(companyName);
      
      // Ensure the API returns the correct structure conforming to ResearchState
      setResult({
        ...data,
        status: "completed",
        companyName,
      } as ResearchState);
      
      setStatus("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setStatus("idle");
    }
  }, [companyName]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setCompanyName("");
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* ── Hero Section (visible in idle + loading states) ── */}
      {status !== "results" && (
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/[0.04] blur-3xl" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/[0.03] blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
            {/* Badge */}
            <div className="flex justify-center mb-6 animate-fade-in">
              <Badge variant="info" size="md" dot>
                Multi-Agent AI Research System
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center tracking-tight mb-6 animate-fade-in">
              <span className="text-slate-100">Investment Research</span>
              <br />
              <span className="gradient-text">Powered by AI Agents</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 text-center max-w-2xl mx-auto mb-12 animate-fade-in leading-relaxed">
              Enter a company name and our multi-agent system will analyze it
              across four dimensions — company fundamentals, financials, news
              sentiment, and risk factors — to deliver a comprehensive
              investment recommendation.
            </p>

            {/* Search Card */}
            <Card glow className="max-w-2xl mx-auto animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter company name (e.g., Tesla, Apple, Microsoft)..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  disabled={status === "loading"}
                  leftIcon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  }
                />
                <Button
                  size="lg"
                  isLoading={status === "loading"}
                  onClick={handleAnalyze}
                  disabled={!companyName.trim() || status === "loading"}
                  className="sm:w-auto w-full whitespace-nowrap"
                >
                  {status === "loading" ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </Card>

            {/* Error State */}
            {error && (
              <div className="max-w-2xl mx-auto mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 animate-slide-up">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold mb-1">Analysis Failed</h4>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Loading State ── */}
      {status === "loading" && <AnalysisLoading companyName={companyName} />}

      {/* ── Results Dashboard ── */}
      {status === "results" && result && (
        <div className="pt-8">
          {/* Back / New Search bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                New Research
              </button>

              {/* Inline quick search */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search another company..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="!py-2 !text-sm w-64"
                  leftIcon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  }
                />
                <Button
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={!companyName.trim()}
                >
                  Analyze
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <DashboardGrid data={result} />
        </div>
      )}

      {/* ── Agent Architecture Display (idle only) ── */}
      {status === "idle" && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-slate-200 mb-3">
              Multi-Agent Architecture
            </h2>
            <p className="text-slate-500 text-sm">
              Six specialized AI agents collaborate to produce comprehensive
              research
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "📋",
                name: "Research Coordinator",
                desc: "Extracts company context, ticker, industry, and sector identification",
                color: "from-violet-500/20 to-purple-500/20",
              },
              {
                icon: "🏢",
                name: "Company Agent",
                desc: "Business model, competitive advantage, market position, strengths & weaknesses",
                color: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: "💰",
                name: "Finance Agent",
                desc: "Revenue growth, profitability, financial health, investment attractiveness",
                color: "from-emerald-500/20 to-green-500/20",
              },
              {
                icon: "📰",
                name: "News Agent",
                desc: "Recent developments, positive & negative catalysts, market sentiment",
                color: "from-amber-500/20 to-yellow-500/20",
              },
              {
                icon: "⚠️",
                name: "Risk Agent",
                desc: "Regulatory, competition, industry, and execution risk assessment",
                color: "from-red-500/20 to-orange-500/20",
              },
              {
                icon: "🏛️",
                name: "Investment Committee",
                desc: "Synthesizes all analyses, calculates score, delivers INVEST or PASS",
                color: "from-indigo-500/20 to-blue-500/20",
              },
            ].map((agent) => (
              <Card
                key={agent.name}
                className="group hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-lg mb-3`}
                >
                  {agent.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1.5">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {agent.desc}
                </p>
              </Card>
            ))}
          </div>

          {/* Tech Stack Footer */}
          <div className="mt-16 text-center">
            <p className="text-xs text-slate-600 mb-4 uppercase tracking-widest font-medium">
              Built with
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                "Next.js 15",
                "TypeScript",
                "LangGraph.js",
                "LangChain.js",
                "Google Gemini",
                "Tailwind CSS",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
