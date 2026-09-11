import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getComplaintById } from '@/api';
import AttachedImage from '../features/diagnosis-detail/components/AttachedImage';
import QuickActions from '../features/diagnosis-detail/components/QuickActions';
import DiagnosisInfo from '../features/diagnosis-detail/components/DiagnosisInfo';
import AiAnalysisResult from '../features/diagnosis-detail/components/AiAnalysisResult';

const DiagnosisDetailPage = () => {
    const { id } = useParams();
    const [complaintData, setComplaintData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getComplaintById(id as string);
                setComplaintData(data);
                console.log('로드된 데이터:', data);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

    if (!complaintData) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-red-500">민원 데이터를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <Link to="/ai-diagnosis" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon />
                    <span className="ml-2">돌아가기</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">진단 상세보기</h1>
                <p className="text-md text-gray-500">ID: {id}</p>
            </div>
            
            {/* 메인 콘텐츠 그리드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* 왼쪽 컬럼 */}
                <div className="lg:col-span-2 space-y-6">
                    <DiagnosisInfo complaintData={complaintData} />
                    <AiAnalysisResult complaintData={complaintData} />
                </div>
                
                {/* 오른쪽 컬럼 */}
                <div className="space-y-6">
                    <AttachedImage complaintData={complaintData} />
                    <QuickActions complaintData={complaintData} />
                </div>
            </div>
        </div>
    );
};

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

export default DiagnosisDetailPage;
