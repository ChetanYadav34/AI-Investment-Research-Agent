// ============================================
// AnalysisLoading — Multi-Agent Pipeline Animation
// AI Investment Research Agent
// ============================================

"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui";

interface AgentStep {
  name: string;
  icon: string;
  status: "pending" | "running" | "completed";
  description: string;
}

const PIPELINE_STEPS: Omit<AgentStep, "status">[] = [
  {
    name: "Research Coordinator",
    icon: "📋",
    description: "Extracting company context and identifiers...",
  },
  {
    name: "Company Agent",
    icon: "🏢",
    description: "Analyzing business model and competitive position...",
  },
  {
    name: "Finance Agent",
    icon: "💰",
    description: "Evaluating financial health and growth metrics...",
  },
  {
    name: "News Agent",
    icon: "📰",
    description: "Assessing recent developments and sentiment...",
  },
  {
    name: "Risk Agent",
    icon: "⚠️",
    description: "Identifying regulatory, competition and execution risks...",
  },
  {
    name: "Investment Committee",
    icon: "🏛️",
    description: "Synthesizing analyses into final recommendation...",
  },
];

interface AnalysisLoadingProps {
  companyName: string;
}

export default function AnalysisLoading({ companyName }: AnalysisLoadingProps) {
  const [steps, setSteps] = useState<AgentStep[]>(
    PIPELINE_STEPS.map((s) => ({ ...s, status: "pending" }))
  );
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Simulate agent pipeline progression
    const timers: NodeJS.Timeout[] = [];

    // Step 0: Coordinator starts immediately
    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: "running" } : s))
        );
      }, 100)
    );

    // Step 0 completes, steps 1-4 start in parallel
    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => {
            if (i === 0) return { ...s, status: "completed" };
            if (i >= 1 && i <= 4) return { ...s, status: "running" };
            return s;
          })
        );
        setCurrentStep(1);
      }, 400)
    );

    // Parallel agents complete at staggered times
    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === 1 ? { ...s, status: "completed" } : s))
        );
      }, 800)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === 3 ? { ...s, status: "completed" } : s))
        );
      }, 1000)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === 2 ? { ...s, status: "completed" } : s))
        );
      }, 1200)
    );

    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === 4 ? { ...s, status: "completed" } : s))
        );
        setCurrentStep(5);
      }, 1400)
    );

    // Committee starts
    timers.push(
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === 5 ? { ...s, status: "running" } : s))
        );
      }, 1500)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Multi-Agent Analysis in Progress
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Analyzing{" "}
          <span className="gradient-text">{companyName}</span>
        </h2>
        <p className="text-sm text-slate-500">
          6 specialized AI agents are collaborating to produce your report
        </p>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-white/[0.04]">
          {steps.map((step, idx) => (
            <div
              key={step.name}
              className={`
                flex items-center gap-4 px-5 py-4
                transition-all duration-500
                ${step.status === "running" ? "bg-blue-500/[0.04]" : ""}
                ${step.status === "completed" ? "bg-emerald-500/[0.02]" : ""}
              `}
            >
              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                  transition-all duration-300
                  ${step.status === "pending" ? "bg-white/[0.03] opacity-40" : ""}
                  ${step.status === "running" ? "bg-blue-500/10 animate-pulse" : ""}
                  ${step.status === "completed" ? "bg-emerald-500/10" : ""}
                `}
              >
                {step.status === "completed" ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className={`
                      text-sm font-semibold transition-colors duration-300
                      ${step.status === "pending" ? "text-slate-600" : ""}
                      ${step.status === "running" ? "text-slate-200" : ""}
                      ${step.status === "completed" ? "text-slate-300" : ""}
                    `}
                  >
                    {step.name}
                  </h3>
                  {/* Parallel indicator */}
                  {idx >= 1 && idx <= 4 && step.status === "running" && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-violet-500/10 text-violet-400 font-medium">
                      PARALLEL
                    </span>
                  )}
                </div>
                <p
                  className={`
                    text-xs mt-0.5 transition-colors duration-300
                    ${step.status === "running" ? "text-slate-400" : "text-slate-600"}
                  `}
                >
                  {step.status === "completed"
                    ? "Completed"
                    : step.description}
                </p>
              </div>

              {/* Status indicator */}
              <div className="shrink-0">
                {step.status === "running" && (
                  <div className="relative h-5 w-5">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
                  </div>
                )}
                {step.status === "completed" && (
                  <span className="text-xs text-emerald-400/60 font-medium">
                    Done
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/[0.03]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700 ease-out"
            style={{
              width: `${(steps.filter((s) => s.status === "completed").length / steps.length) * 100}%`,
            }}
          />
        </div>
      </Card>
    </div>
  );
}
