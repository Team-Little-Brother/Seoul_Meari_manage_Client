import DashboardStatCard from '../features/dashboard/components/DashboardStatCard';
import { WeeklyDiagnosisChart, RiskDistributionChart } from '../features/dashboard/components/Charts';
import HourlyActivityChart from '../features/dashboard/components/HourlyActivityChart';
import { useState, useRef } from 'react';
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboardData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Tab = '진단 분석' | '사용량 분석';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState<Tab>('진단 분석');
    const { data: summaryData, isLoading: isSummaryLoading, isError: isSummaryError } = useDashboardSummary();
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = () => {
        if (!dashboardRef.current) return;

        html2canvas(dashboardRef.current, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('dashboard-report.pdf');
        });
    };

    const formatChangeRate = (rate: number) => {
        const sign = rate > 0 ? '+' : '';
        const status = rate > 0 ? '증가' : '감소';
        return `${sign}${rate}% ${status}`;
    }

    const stats = summaryData ? [
        { title: '총 진단 건수', value: summaryData.totalDiagnoses.count.toLocaleString(), change: formatChangeRate(summaryData.totalDiagnoses.changeRate), subtitle: '지난 7일 대비', icon: <TrendingUpIcon /> },
        { title: '해결률', value: `${summaryData.resolutionRate.rate}%`, change: formatChangeRate(summaryData.resolutionRate.changeRate), subtitle: '지난 7일 대비', icon: <CheckBadgeIcon /> },
        { title: '메아리 수', value: summaryData.echoCount.count.toLocaleString(), subtitle: '전체', icon: <UsersIcon /> },
    ] : [];
    
    const renderContent = () => {
        switch (activeTab) {
            case '진단 분석':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        <div className="lg:col-span-2">
                            <WeeklyDiagnosisChart />
                        </div>
                        <div className="h-full">
                            <RiskDistributionChart />
                        </div>
                    </div>
                );
            case '사용량 분석':
                return <HourlyActivityChart />;
            default:
                return null;
        }
    };
    
    const TabButton: React.FC<{ tabName: Tab }> = ({ tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === tabName
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-500 hover:bg-white/60'
            }`}
        >
            {tabName}
        </button>
    );

    return (
        <div className="space-y-8">
            {/* 페이지 헤더 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">통계 분석</h1>
                    <p className="text-md text-gray-500 mt-1">데이터 분석 및 인사이트</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button onClick={handleExportPDF} className="flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50">
                        <DownloadIcon /> <span className="ml-2">내보내기</span>
                    </button>
                </div>
            </div>
            <div ref={dashboardRef}>
                {/* 통계 카드 */}
                {isSummaryLoading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-lg animate-pulse" />)}
                    </div>
                )}
                {isSummaryError && <div className="text-red-500">통계 정보를 불러오는데 실패했습니다.</div>}
                {summaryData && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        {stats.map((item) => (
                            <DashboardStatCard key={item.title} {...item} />
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                    <TabButton tabName="진단 분석" />
                    <TabButton tabName="사용량 분석" />
                </div>

                {/* Main Content based on Tab */}
                <div className="mt-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

// Icons
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export default DashboardPage;
