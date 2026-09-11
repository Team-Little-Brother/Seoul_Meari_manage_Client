interface QuickActionsProps {
    complaintData: any;
}

const QuickActions = ({ complaintData }: QuickActionsProps) => {
    const handleResolve = () => {
        // 해결 완료 처리 로직
        console.log('민원 해결 완료 처리:', complaintData.complaint_id);
        alert('민원이 해결 완료로 처리되었습니다.');
    };

    const handleAssign = () => {
        // 담당자 할당 로직
        console.log('담당자 할당:', complaintData.complaint_id);
        alert('담당자 할당 기능은 준비 중입니다.');
    };

    const handleReport = () => {
        // 리포트 생성 로직
        console.log('리포트 생성:', complaintData.complaint_id);
        alert('리포트 생성 기능은 준비 중입니다.');
    };

    const handleMapView = () => {
        // 지도에서 보기 로직
        const mapUrl = `https://www.google.com/maps?q=${complaintData.latitude},${complaintData.longitude}`;
        window.open(mapUrl, '_blank');
    };

    const actions = [
        { 
            name: complaintData.is_confirmed ? '이미 해결됨' : '해결 완료 처리', 
            icon: <CheckCircleIcon />, 
            primary: !complaintData.is_confirmed,
            disabled: complaintData.is_confirmed,
            onClick: handleResolve
        },
        { 
            name: '담당자 할당', 
            icon: <UserAddIcon />, 
            onClick: handleAssign
        },
        { 
            name: '리포트 생성', 
            icon: <DocumentDownloadIcon />, 
            onClick: handleReport
        },
        { 
            name: '지도에서 보기', 
            icon: <MapIcon />, 
            onClick: handleMapView
        },
    ];

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">빠른 작업</h3>
            <div className="mt-4 space-y-3">
                {actions.map((action) => (
                    <button
                        key={action.name}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                        ${action.disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : action.primary
                                ? 'bg-teal-500 text-white hover:bg-teal-600'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {action.icon}
                        <span className="ml-3">{action.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Icons
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserAddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const DocumentDownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;

export default QuickActions;
