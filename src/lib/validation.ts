// ============================================
// Input Validation
// AI Investment Research Agent
// ============================================

import { z } from "zod";

export const companyNameSchema = z
  .string({
    error: "Company name must be a string",
  })
  .trim()
  .min(1, "Company name is required")
  .max(100, "Company name must be 100 characters or less");

export function validateCompanyName(name: unknown): {
  valid: boolean;
  error?: string;
  value?: string;
} {
  const result = companyNameSchema.safeParse(name);

  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || "Invalid company name",
    };
  }

  return { valid: true, value: result.data };
}
