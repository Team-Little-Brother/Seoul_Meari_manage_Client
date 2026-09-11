interface DiagnosisInfoProps {
    complaintData: any;
}

const DiagnosisInfo = ({ complaintData }: DiagnosisInfoProps) => {
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

    // 상태 표시
    const getStatusDisplay = (isConfirmed: boolean) => {
        return isConfirmed ? '해결됨' : '미해결';
    };

    // 상태 색상
    const getStatusColor = (isConfirmed: boolean) => {
        return isConfirmed 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <LocationMarkerIcon />
                        <span className="ml-2">{getDangerText(complaintData.danger)}</span>
                    </h3>
                    <div className="mt-2 text-sm text-gray-500 space-x-4">
                        <span>좌표: {complaintData.latitude}, {complaintData.longitude}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaintData.is_confirmed)}`}>
                        {getStatusDisplay(complaintData.is_confirmed)}
                    </span>
                </div>
            </div>
            
            <div className="border-t my-4"></div>

            {/* Body */}
            <div>
                <h4 className="mt-4 font-semibold text-gray-800">상세 설명</h4>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {complaintData.detail || '상세 설명이 없습니다.'}
                </p>
            </div>
        </div>
    );
};

const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default DiagnosisInfo;
