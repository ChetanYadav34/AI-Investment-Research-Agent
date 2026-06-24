// ============================================
// useResearch Hook — Research Lifecycle Manager
// AI Investment Research Agent
// ============================================

"use client";

import { useState, useCallback } from "react";
import type { ResearchState } from "@/types/graph.types";
import type { ResearchResponse } from "@/types/api.types";
import { API_CONFIG } from "@/lib/constants";
import { validateCompanyName } from "@/lib/validation";

/**
 * UI state managed by the hook.
 */
interface UseResearchState {
  status: "idle" | "loading" | "success" | "error";
  companyName: string;
  result: ResearchState | null;
  error: string | null;
}

/**
 * Custom hook that manages the entire research lifecycle.
 * Encapsulates API communication, validation, loading state, and error handling.
 *
 * Components using this hook remain pure — they only render data.
 */
export function useResearch() {
  const [state, setState] = useState<UseResearchState>({
    status: "idle",
    companyName: "",
    result: null,
    error: null,
  });

  /**
   * Starts the research analysis for a given company.
   * Validates input, calls the API, and updates state.
   */
  const startResearch = useCallback(async (companyName: string) => {
    // ── Validate input ──
    const validation = validateCompanyName(companyName);
    if (!validation.valid) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: validation.error || "Invalid company name",
      }));
      return;
    }

    // ── Set loading state ──
    setState({
      status: "loading",
      companyName: validation.value!,
      result: null,
      error: null,
    });

    try {
      // ── Call API ──
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.timeoutMs
      );

      const response = await fetch(API_CONFIG.researchEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: validation.value }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: ResearchResponse = await response.json();

      if (data.success) {
        setState((prev) => ({
          ...prev,
          status: "success",
          result: data.data,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: data.error.message,
        }));
      }
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Analysis timed out. Please try again."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred";

      setState((prev) => ({
        ...prev,
        status: "error",
        error: message,
      }));
    }
  }, []);

  /**
   * Resets the state to idle.
   */
  const reset = useCallback(() => {
    setState({
      status: "idle",
      companyName: "",
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    startResearch,
    reset,
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  };
}
