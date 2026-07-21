/**
 * Query-parameter types for the three frontend features.
 *
 * These describe what each feature SENDS to the backend, mapping to the
 * query params documented at `/docs`. Property names use snake_case to match
 * the API's query-parameter names exactly. Dates are always strings in
 * `YYYY-MM-DD` format (the API parses them into calendar dates).
 * Types only — no request code here.
 */

import type { OperationType } from "./api-types";

/**
 * Shared optional date-range filter.
 *
 * Both fields are optional and independent:
 * - Neither set → the endpoint returns all available data.
 * - Only one set → the range is open-ended on the missing side
 *   (`start_date` only = from that date onward; `end_date` only = up to that date).
 *
 * Dates MUST be formatted `YYYY-MM-DD` (e.g. `"2025-03-01"`). Valid values fall
 * within the dataset bounds reported by `FacetsResponse.min_date`/`max_date`.
 */
export interface DateRangeFilter {
  /** Inclusive start of the range, `YYYY-MM-DD`. Omit for no lower bound. */
  start_date?: string;
  /** Inclusive end of the range, `YYYY-MM-DD`. Omit for no upper bound. */
  end_date?: string;
}

/**
 * Query parameters for `GET /api/metrics/alerts` (Feature 2).
 * Extends the shared date-range filter so the alerts table respects the
 * dashboard date range from Feature 1 when one is active.
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Spike sensitivity as a ratio above baseline. The UI exposes this as a
   * numeric input constrained to `0.01`–`1.0`, defaulting to `0.3`.
   * (The API itself only enforces `>= 0`; the tighter bound is a UI rule.)
   * A period is flagged when its `increase_ratio` exceeds this threshold.
   */
  threshold: number;
}

/**
 * Query parameters for `GET /api/metrics/categories/top` (Feature 3).
 * Extends the shared date-range filter so each panel can be filtered by date.
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Operation type to rank. For Feature 3 this is always `"income"`, since the
   * B2B/B2C panels show top income categories.
   */
  operation_type: OperationType;
  /**
   * Maximum number of categories to return. Feature 3 uses `5`.
   * API constraint: integer between `1` and `20` inclusive.
   */
  limit: number;
  /**
   * Which business line to rank. Feature 3 issues one request per panel:
   * `"B2B"` for the left panel and `"B2C"` for the right. Required here so the
   * two panels can be split; omitting it would mix both lines together.
   */
  business_type: "B2B" | "B2C";
}
