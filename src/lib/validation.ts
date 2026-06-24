// ============================================
// Input Validation (Zod schemas added in Phase 6)
// AI Investment Research Agent
// ============================================

/**
 * Basic input validation for the company name.
 * Zod-based validation will be added when Zod is installed in Phase 6.
 */
export function validateCompanyName(name: unknown): {
  valid: boolean;
  error?: string;
  value?: string;
} {
  if (typeof name !== "string") {
    return { valid: false, error: "Company name must be a string" };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Company name is required" };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Company name must be 100 characters or less" };
  }

  return { valid: true, value: trimmed };
}
