// ============================================
// API Request/Response Type Definitions
// AI Investment Research Agent
// ============================================

import type { ResearchState } from "./graph.types";

/**
 * POST /api/research request body.
 */
export interface ResearchRequest {
  companyName: string;
}

/**
 * Successful API response wrapping the full research state.
 */
export interface ResearchSuccessResponse {
  success: true;
  data: ResearchState;
  timestamp: string;
}

/**
 * Error API response.
 */
export interface ResearchErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}

/**
 * Union type for all API responses.
 */
export type ResearchResponse = ResearchSuccessResponse | ResearchErrorResponse;
