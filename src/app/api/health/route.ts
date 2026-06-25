// ============================================
// Health Check API — /api/health
// AI Investment Research Agent
// ============================================
// Tests Gemini connectivity and reports system status.
// Useful for: deployment validation, monitoring, debugging.

import { NextResponse } from "next/server";
import { testConnection } from "@/services/gemini.service";
import { getEnv } from "@/lib/env";

export async function GET() {
  const startTime = Date.now();

  try {
    // Validate environment
    const env = getEnv();

    // Test Gemini connection
    const gemini = await testConnection();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: `${Date.now() - startTime}ms`,
      services: {
        gemini: {
          connected: gemini.success,
          model: gemini.model,
          latencyMs: gemini.durationMs,
        },
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        appName: env.client.NEXT_PUBLIC_APP_NAME,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
