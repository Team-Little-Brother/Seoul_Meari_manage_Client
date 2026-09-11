import { useState, useEffect, useMemo } from 'react';
import { getComplaintsList } from '@/api';
import AiStatCard from '../features/ai-diagnosis/components/AiStatCard';
import FilterPanel, { StatusType, SortByType } from '../features/ai-diagnosis/components/FilterPanel';
import DiagnosisCard from '../features/ai-diagnosis/components/DiagnosisCard';
import ArEchoMap from '../features/ai-diagnosis/components/ArEchoMap';
import { useAiSummary } from '@/features/dashboard/hooks/useDashboardData';
import { Spinner } from '@/components/common/Spinner';

// API에서 민원 데이터를 가져오는 함수
// const fetchComplaintsList = async () => {
//   try {
//     const response = await fetch('http://localhost:3000/complaints/complaints-list', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     console.log(response);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('민원 데이터를 가져오는 중 오류 발생:', error);
//     throw error;
//   }
// };

// 민원 데이터를 DiagnosisCard 형식으로 변환하는 함수
const transformComplaintToDiagnosis = (complaint: any, index: number) => {
  // 상태 매핑 (is_confirmed에 따라)
  const getStatus = (isConfirmed: boolean) => {
    return isConfirmed ? '해결됨' : '대기';
  };

  // 위험도 한글 변환
  const getDangerText = (danger: string) => {
    const dangerMap: { [key: string]: string } = {
      'illegal_dumping': '불법 투기',
      'pothole': '도로 파손',
      'broken_sidewalk': '보도 파손',
      'damaged_sign': '표지판 손상',
      'graffiti': '낙서'
    };
    return dangerMap[danger] || danger;
  };

  return {
    id: complaint.complaint_id,
    title: getDangerText(complaint.danger) || `민원 #${index + 1}`,
    description: complaint.detail || '민원 내용 없음',
    timestamp: complaint.timestamp || new Date().toISOString(),
    location: `${complaint.latitude}, ${complaint.longitude}`,
    confidence: complaint.accuracy || 75,
    status: getStatus(complaint.is_confirmed) as '대기' | '해결됨',
    image: complaint.S3_url,
  };
};

const AiDiagnosisPage = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [complaintsData, setComplaintsData] = useState<any[]>([]);
  const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useAiSummary();
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusType>('전체 상태');
  const [sortBy, setSortBy] = useState<SortByType>('최신순');

  // 민원 데이터 가져오기
  useEffect(() => {
    const loadComplaintsData = async () => {
        setComplaintsLoading(true);
        setComplaintsError(null);
      
      try {
        const data = await getComplaintsList();
        setComplaintsData(data);
      } catch (err) {
        setComplaintsError('민원 데이터를 불러오는데 실패했습니다.');
      } finally {
        setComplaintsLoading(false);
      }
    };

    loadComplaintsData();
  }, []);

  const processedData = useMemo(() => {
    let data = [...complaintsData];

    // 1. 필터링 (status)
    if (status === '해결') {
      data = data.filter(c => c.is_confirmed === true);
    } else if (status === '미해결') {
      data = data.filter(c => c.is_confirmed === false);
    }

    // 2. 정렬 (sortBy)
    data.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortBy === '최신순' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [complaintsData, status, sortBy]);


  const stats = summaryData ? [
    { title: '총 진단 건수', value: summaryData.total.count.toLocaleString(), change: `+${summaryData.total.change.toLocaleString()}`, icon: <ChartBarIcon />, iconBgColor: 'bg-blue-100 text-blue-600' },
    { title: '미처리', value: summaryData.pending.count.toLocaleString(), change: `+${summaryData.pending.change.toLocaleString()}`, icon: <ClockIcon />, iconBgColor: 'bg-yellow-100 text-yellow-600' },
    { title: '처리', value: summaryData.resolved.count.toLocaleString(), change: `+${summaryData.resolved.change.toLocaleString()}`, icon: <CheckCircleIcon />, iconBgColor: 'bg-green-100 text-green-600' },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI 도시 진단</h1>
          <p className="text-md text-gray-500 mt-1">실시간 위험 요소 분석 및 관리</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      {isSummaryLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />)}
        </div>
      )}
      {isSummaryError && <div className="text-red-500">통계 정보를 불러오는데 실패했습니다.</div>}
      {summaryData && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <AiStatCard key={item.title} {...item} />
          ))}
        </div>
      )}
      
      {/* Filter Panel */}
      <FilterPanel 
        activeView={view} 
        onViewChange={setView}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />
      
      {/* 민원 데이터 정보 */}
      {!complaintsLoading && !complaintsError && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900">
              {status} 민원 ({processedData.length}건)
            </h3>
            <span className="text-sm text-blue-600">
              정렬: {sortBy}
            </span>
          </div>
        </div>
      )}

      {/* Conditional Content */}
      {view === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 민원 데이터 표시 */}
          {complaintsLoading ? (
            <div className="col-span-2 flex justify-center py-12"><Spinner /></div>
          ) : complaintsError ? (
            <div className="col-span-2 text-center py-12 text-red-500">{complaintsError}</div>
          ) : processedData.length > 0 ? (
            processedData.map((complaint, index) => {
              const transformedData = transformComplaintToDiagnosis(complaint, index);
              return (
                <DiagnosisCard 
                  key={`complaint-${index}`}
                  {...transformedData}
                />
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">민원 데이터가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">API에서 데이터를 가져오는 중이거나 데이터가 없습니다.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
            <ArEchoMap complaints={processedData} />
        </div>
      )}
    </div>
  );
};


// Icons (ensure all necessary icons are here)
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default AiDiagnosisPage;
