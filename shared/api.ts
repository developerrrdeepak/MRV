/**
 * Shared API types between client and server
 * Contains interfaces for API responses and common data structures
 */

/**
 * Health check response from /api/health endpoint
 */
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: "connected" | "disconnected";
    server: "running";
  };
  message: string;
}

/**
 * Standard API response wrapper
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Pagination metadata for list endpoints
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: PaginationMeta;
}

// Estimator API types
export interface EstimatorRequest {
  areaHectares: number; // land area
  projectType: "agroforestry" | "rice" | "soil" | "biomass";
  ndvi?: number; // 0-1
  biomass?: number; // t/ha
  irrigation?: "drip" | "sprinkler" | "flood" | "rainfed";
  soilPh?: number; // 0-14
  durationYears?: number; // years
  baselineCarbon?: number; // optional baseline tCO2/ha/yr
}

export interface EstimatorResult {
  creditsPerYear: number; // tCO2e credits/year
  totalCredits: number; // over duration
  estimatedIncomeINR: number; // INR
  assumptions: Record<string, number | string>;
}
