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

// Carbon estimation API types
export type CarbonEstimateRequest = {
  mode: "soil" | "soil_gkg" | "agb" | "allometric";
  payload: any;
  metadata?: {
    aoi?: string;
    source?: string;
    unit?: string;
  };
};

export interface CarbonEstimateResponse {
  success: boolean;
  type: "soil" | "agb";
  carbon_t_ha: number;
  co2e_t_ha: number;
  details?: Record<string, number>;
  timestamp: string;
  id?: string;
}
