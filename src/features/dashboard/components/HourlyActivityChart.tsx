import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useHourlyComplaintDistribution } from '../hooks/useDashboardData';
import { Spinner } from '@/components/common/Spinner';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

const HourlyActivityChart: React.FC = () => {
    const { data: hourlyData, isLoading, isError } = useHourlyComplaintDistribution();

    const data = {
        labels: hourlyData?.map(d => `${d.hour.toString().padStart(2, '0')}:00`) || [],
        datasets: [
            {
                label: '시간대별 민원',
                data: hourlyData?.map(d => d.count) || [],
                fill: false,
                borderColor: '#2c7a7b', // teal-700
                backgroundColor: '#4fd1c5', // teal-400
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <ChartContainer title="시간대별 민원 집중도">
            <LoadingOrError isLoading={isLoading} isError={isError} />
            {hourlyData && <Line options={options} data={data} />}
        </ChartContainer>
    );
};

export default HourlyActivityChart;
