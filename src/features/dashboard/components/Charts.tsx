import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useWeeklyDiagnoses, useTagDistribution } from '../hooks/useDashboardData';
import { Spinner } from '@/components/common/Spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode; height?: string }> = ({ title, children, height = '410px' }) => (
    <div className="bg-white p-6 shadow rounded-lg flex flex-col" style={{ height }}>
        <h3 className="text-lg font-semibold text-gray-900 flex-shrink-0">{title}</h3>
        <div className="mt-4 relative flex-grow">
            {children}
        </div>
    </div>
);

const LoadingOrError: React.FC<{ isLoading: boolean; isError: boolean }> = ({ isLoading, isError }) => {
    if (isLoading) return <div className="h-full flex justify-center items-center"><Spinner /></div>;
    if (isError) return <div className="h-full flex justify-center items-center text-red-500">데이터 로딩 실패</div>;
    return null;
};


const WeeklyDiagnosisChart = () => {
    const { data: weeklyData, isLoading, isError } = useWeeklyDiagnoses();

    const data = {
        labels: weeklyData?.map(d => new Date(d.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })) || [],
        datasets: [
            {
                label: '진단 건수',
                data: weeklyData?.map(d => d.total) || [],
                backgroundColor: '#4fd1c5', // teal-400
                borderRadius: 4,
            },
            {
                label: '해결 건수',
                data: weeklyData?.map(d => d.resolved) || [],
                backgroundColor: '#2c7a7b', // teal-700
                borderRadius: 4,
            },
        ],
    };
    const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' as const } } };
    
    return (
        <ChartContainer title="주간 진단 현황">
            <LoadingOrError isLoading={isLoading} isError={isError} />
            {weeklyData && <Bar options={options} data={data} />}
        </ChartContainer>
    );
};

const DiagnosisTypeDistributionChart = () => {
    const { data: tagData, isLoading, isError } = useTagDistribution();

    const data = {
        labels: tagData?.map(t => t.tag) || [],
        datasets: [{
            data: tagData?.map(t => t.count) || [],
            backgroundColor: ['#38b2ac', '#f6ad55', '#ef4444', '#4299e1', '#a0aec0'], 
            hoverBackgroundColor: ['#319795', '#ed8936', '#dc2626', '#3182ce', '#718096'],
            borderWidth: 0,
        }],
    };
    const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const } } };

    return (
        <ChartContainer title="진단 유형별 분포" height="100%">
            <LoadingOrError isLoading={isLoading} isError={isError} />
            {tagData && <Doughnut data={data} options={options} />}
        </ChartContainer>
    );
};

export { WeeklyDiagnosisChart, DiagnosisTypeDistributionChart as RiskDistributionChart };
