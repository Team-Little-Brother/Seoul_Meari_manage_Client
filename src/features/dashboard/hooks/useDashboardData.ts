import { useQuery } from 'react-query';
import * as api from '@/api/dashboardAPI';
import * as types from '../types';

// 1. 일반 대시보드 핵심 지표 요약 훅
export const useDashboardSummary = () => {
  return useQuery<types.DashboardSummary, Error>(['dashboardSummary'], api.getDashboardSummary);
};

// 2. AI 도시 진단 페이지 핵심 지표 요약 훅
export const useAiSummary = () => {
  return useQuery<types.AiSummary, Error>(['aiSummary'], api.getAiSummary);
};

// 3. 주간 진단 현황 훅
export const useWeeklyDiagnoses = () => {
  return useQuery<types.WeeklyDiagnosis[], Error>(['weeklyDiagnoses'], api.getWeeklyDiagnoses);
};

// 4. 진단 유형별 분포 훅
export const useTagDistribution = () => {
  return useQuery<types.TagDistribution[], Error>(['tagDistribution'], api.getTagDistribution);
};

// 5. 민원 시간별 분포 훅
export const useHourlyComplaintDistribution = () => {
  return useQuery<types.HourlyComplaint[], Error>(['hourlyComplaints'], api.getHourlyComplaintDistribution);
};
