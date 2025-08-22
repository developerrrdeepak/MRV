/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Farmer API response types
 */
export interface FarmersListResponse {
  farmers: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FarmerStatsResponse {
  totalFarmers: number;
  activeFarmers: number;
  totalFarmArea: number;
  recentRegistrations: number;
  farmersByState: Array<{ _id: string; count: number }>;
  farmersByGender: Array<{ _id: string; count: number }>;
}

/**
 * Carbon Project API response types
 */
export interface ProjectsListResponse {
  projects: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProjectMetricsResponse {
  project: {
    projectId: string;
    name: string;
    status: string;
    projectType: string;
  };
  carbonMetrics: {
    baseline: number;
    projected: number;
    actual: number;
    verified: number;
    efficiency: number;
  };
  progress: {
    percentage: number;
    completedActivities: number;
    totalActivities: number;
    participantCount: number;
    measurementCount: number;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    daysRemaining: number;
  };
  financials: {
    totalBudget: number;
    spentAmount: number;
    carbonPrice: number;
    potentialRevenue: number;
  };
}

export interface ProjectStatsResponse {
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  totalProjectedReductions: number;
  recentProjects: number;
  projectsByType: Array<{ _id: string; count: number }>;
  projectsByStatus: Array<{ _id: string; count: number }>;
}
