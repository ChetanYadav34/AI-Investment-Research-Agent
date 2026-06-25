// ============================================
// SourcesCard — Cited Sources
// AI Investment Research Agent
// ============================================

import React from "react";
import type { Source } from "@/types/agents.types";
import { Card, CardHeader, CardContent } from "@/components/ui";

interface SourcesCardProps {
  sources: Source[];
}

export default function SourcesCard({ sources }: SourcesCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500/20 to-gray-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Sources Cited
          </h3>
          <p className="text-xs text-slate-500">
            {sources.length} sources referenced
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {sources.map((source, i) => (
            <li key={i}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors duration-200"
              >
                {/* Number */}
                <span className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                  {i + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors truncate">
                    {source.title}
                  </p>
                  <p className="text-[10px] text-slate-600 truncate">
                    {source.url}
                  </p>
                </div>

                {/* External icon */}
                <svg
                  className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
