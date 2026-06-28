// ============================================
// Research API Route
// AI Investment Research Agent
// ============================================

import { NextResponse } from "next/server";
import { researchGraph } from "@/graph";
import { researchRequestSchema } from "@/lib/schemas";
import { GeminiError, GeminiTimeoutError } from "@/services/gemini.service";
import { ChainExecutionError } from "@/chains/chain.runner";

// Maximum execution time for the route (Next.js config)
export const maxDuration = 300; // 5 minutes (requires Pro for Vercel, but local is fine)

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // 1. Parse and Validate Request
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, errors: ["Invalid JSON body"] },
        { status: 400 }
      );
    }

    const parseResult = researchRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.issues.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    const { companyName } = parseResult.data;

    // 2. Initialize Graph State & Execute Workflow
    // Use an AbortController to implement an API-level timeout just in case.
    // However, graph invoke natively doesn't accept signals easily without RunnableConfig.
    // We can rely on internal GeminiService timeouts for now, or just invoke directly.
    const resultState = await researchGraph.invoke(
      { companyName },
      { configurable: { thread_id: Date.now().toString() } }
    );

    // 3. Process the Result
    if (resultState.executionStatus === "FAILED" || (resultState.errors && resultState.errors.length > 0)) {
      return NextResponse.json(
        {
          success: false,
          errors: resultState.errors || ["Unknown graph execution error"],
        },
        { status: 500 }
      );
    }

    if (!resultState.finalRecommendation) {
      return NextResponse.json(
        {
          success: false,
          errors: ["Workflow completed but no recommendation was generated"],
        },
        { status: 500 }
      );
    }

    const executionTime = Date.now() - startTime;

    // 4. Return Structured JSON
    return NextResponse.json(
      {
        success: true,
        company: resultState.companyContext,
        companyAnalysis: resultState.companyAnalysis,
        financialAnalysis: resultState.financialAnalysis,
        newsAnalysis: resultState.newsAnalysis,
        riskAnalysis: resultState.riskAnalysis,
        recommendation: resultState.finalRecommendation,
        executionTime,
        errors: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error (Research Route):", error);
    const executionTime = Date.now() - startTime;
    
    if (error instanceof GeminiTimeoutError) {
      return NextResponse.json(
        { success: false, errors: ["LLM Request Timed Out"], executionTime },
        { status: 504 }
      );
    }
    
    if (error instanceof GeminiError || error instanceof ChainExecutionError) {
      return NextResponse.json(
        { success: false, errors: [error.message], executionTime },
        { status: 502 }
      );
    }

    const errMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, errors: [`Internal Server Error: ${errMessage}`], executionTime },
      { status: 500 }
    );
  }
}
