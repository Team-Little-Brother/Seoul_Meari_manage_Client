// 1. GET /dashboard/summary 응답 타입
export interface DashboardSummary {
  totalDiagnoses: {
    count: number;
    changeRate: number;
  };
  resolutionRate: {
    rate: number;
    changeRate: number;
  };
  echoCount: {
    count: number;
  };
}

// 2. GET /dashboard/ai-summary 응답 타입
export interface AiSummary {
  total: {
    count: number;
    change: number;
  };
  resolved: {
    count: number;
    change: number;
  };
  pending: {
    count: number;
    change: number;
  };
}

// 3. GET /dashboard/weekly-diagnoses 응답 타입
export interface WeeklyDiagnosis {
  date: string;
  total: number;
  resolved: number;
}

// 4. GET /dashboard/tag-distribution 응답 타입
export interface TagDistribution {
  tag: string;
  count: number;
}

// 5. GET /dashboard/hourly-complaint-distribution 응답 타입
export interface HourlyComplaint {
  hour: number;
  count: number;
}
