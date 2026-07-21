/**
 * API response types for the three frontend features.
 *
 * These interfaces describe the JSON shapes returned by the backend
 * (`backend/app/routes.py`, visible at `/docs`). They are the source of
 * truth the UI must code against. No implementation lives here — types only.
 *
 * Property names use snake_case to match the API's JSON keys exactly.
 * All money values are plain numbers in the dataset's implicit currency.
 * All dates are ISO calendar dates formatted `YYYY-MM-DD`.
 */

/**
 * A financial operation direction.
 * - `income`: money coming in.
 * - `outcome`: money going out.
 */
export type OperationType = "income" | "outcome";

/**
 * Business line a movement belongs to.
 * - `B2B`: business-to-business.
 * - `B2C`: business-to-consumer.
 */
export type BusinessType = "B2B" | "B2C";

/**
 * Category a movement is classified under.
 * Income movements are typically `sales` (occasionally `others`);
 * outcome movements use `suppliers` | `operational` | `administrative` | `others`.
 */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Response of `GET /api/metrics/facets`.
 *
 * Used by Feature 1 (date-range reference) to show the valid date bounds,
 * and by Feature 3 to list the categories available per group.
 * The dataset spans a rolling ~12 months relative to the server's current
 * date, so `min_date`/`max_date` are dynamic — never hard-code a calendar year.
 */
export interface FacetsResponse {
  /** Distinct operation types present in the dataset. Expected: `["income","outcome"]`. */
  operation_types: OperationType[];
  /** Distinct business types present in the dataset. Expected: `["B2B","B2C"]`. */
  business_types: BusinessType[];
  /**
   * Distinct categories present in the dataset, alphabetically sorted by the API.
   * Feature 3 uses this as the authoritative list of selectable categories.
   */
  categories: Category[];
  /** Earliest `create_date` in the dataset, `YYYY-MM-DD`. Lower bound for date filters. */
  min_date: string;
  /** Latest `create_date` in the dataset, `YYYY-MM-DD`. Upper bound for date filters. */
  max_date: string;
}

/**
 * A single row of the anomaly-alerts table (Feature 2).
 * One entry per period whose outcome spiked above the configured threshold.
 */
export interface AlertEntry {
  /**
   * Period label for the row. Format depends on the `group_by` used by the
   * endpoint: `YYYY-MM` for month (default), `YYYY-Www` for ISO week,
   * or `YYYY-MM-DD` for day.
   */
  period: string;
  /** Recorded total outcome (spending) for this period. */
  outcome_total: number;
  /**
   * Baseline the spike is measured against. IMPORTANT: the API computes this as
   * the mean outcome of ALL periods that precede this one (an expanding/cumulative
   * average), NOT a fixed 3-period rolling window.
   * See `README.md` for the divergence from the original feature brief.
   */
  baseline_average: number;
  /**
   * Relative size of the spike as a fraction of the baseline:
   * `(outcome_total - baseline_average) / baseline_average`. A value of `0.42`
   * means outcome was 42% above baseline. Display as a percentage.
   */
  increase_ratio: number;
}

/**
 * Response of `GET /api/metrics/alerts` (Feature 2).
 * The API returns a bare JSON array; an empty array means no anomalies were
 * detected for the current threshold (the table must show its empty state).
 */
export type AlertsResponse = AlertEntry[];

/**
 * A single top-category row in a B2B or B2C panel (Feature 3).
 * Corresponds to the API's `TopCategoryItem`.
 */
export interface CategoryEntry {
  /** The income category for this row. */
  category: Category;
  /**
   * Operation type this ranking was computed for. For Feature 3 this is always
   * `income`, because the panels rank the top income categories.
   */
  operation_type: OperationType;
  /** Total amount for this category in the selected group/date range. */
  total_amount: number;
}

/**
 * Response of `GET /api/metrics/categories/top` (Feature 3).
 * The API returns a bare JSON array, already sorted by `total_amount` descending
 * and capped by the request's `limit`. An empty array means the group has no
 * matching movements (the panel must show its empty state).
 */
export type TopCategoriesResponse = CategoryEntry[];
