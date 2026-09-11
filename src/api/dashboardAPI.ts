import axiosInstance from './index';

// 1. 일반 대시보드 핵심 지표 요약
export const getDashboardSummary = async () => {
  const response = await axiosInstance.get('/dashboard/summary');
  return response.data;
};

// 2. AI 도시 진단 페이지 핵심 지표 요약
export const getAiSummary = async () => {
  const response = await axiosInstance.get('/dashboard/ai-summary');
  return response.data;
};

// 3. 주간 진단 현황 (막대그래프용)
export const getWeeklyDiagnoses = async () => {
  const response = await axiosInstance.get('/dashboard/weekly-diagnoses');
  return response.data;
};

// 4. 진단 유형별 분포 (원형 그래프용)
export const getTagDistribution = async () => {
  const response = await axiosInstance.get('/dashboard/tag-distribution');
  return response.data;
};

// 5. 민원 시간별 분포 (꺾은선 그래프용)
export const getHourlyComplaintDistribution = async () => {
  const response = await axiosInstance.get('/dashboard/hourly-complaint-distribution');
  return response.data;
};
