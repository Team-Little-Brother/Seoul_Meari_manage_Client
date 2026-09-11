import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { deleteEcho, getEchoById } from '@/api';
import { getPresignedUrl } from '@/api/s3API';

// const fetchEchoData = async (id: string) => {
//     const response = await fetch(`http://localhost:3000/echo/echo-list/${id}`);
//     const data = await response.json();
//     console.log(data);
//     return data;
// };

// const fetchEchoImageKey = async (image_key: string) => {
//     const response = await fetch(`http://localhost:3000/complaints/presigned-url`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ "S3_url": image_key }),
//     });
//     const data = await response.json();
//     return data.presigned_url;
// };

const formatDateTime = (dateTime: string) => {
    try {
        // varchar로 저장된 ISO 형식 문자열 처리
        // 2025-09-17T07:29:33.2146580Z 형식을 Date 객체로 변환
        const date = new Date(dateTime);
        
        // 유효한 날짜인지 확인
        if (isNaN(date.getTime())) {
            console.warn('Invalid date format:', dateTime);
            return dateTime;
        }
        
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch (error) {
        console.error('Date formatting error:', error, 'Original string:', dateTime);
        return dateTime; // 파싱 실패 시 원본 문자열 반환
    }
};

// const fetchDeleteEcho = async (id: string) => {
//     try {
//         console.log('삭제 요청 URL:', `http://localhost:3000/echo/echo-list/${id}`);
//         const response = await fetch(`http://localhost:3000/echo/echo-list/${id}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         return await response.json();
//     } catch (error) {
//         console.error('메아리 삭제 중 오류 발생:', error);
//         throw error;
//     }
// };

const ArEchoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [echoData, setEchoData] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEchoById(id as string);
                setEchoData(data);
                console.log('로드된 데이터:', data);
                
                // image_key가 있으면 presigned URL로 변환
                if (data?.imageKey) {
                    try {
                        const presignedUrl = await getPresignedUrl(data.imageKey);
                        setImageUrl(presignedUrl);
                    } catch (error) {
                        console.error('이미지 URL 변환 실패:', error);
                    }
                }
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            }
        };
        
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleDeleteEcho = async () => {
        if (!id) return;
        
        setIsDeleting(true);
        try {
            await deleteEcho(id);
            alert('메아리가 성공적으로 삭제되었습니다.');
            navigate('/ar-echo');
        } catch (error) {
            alert('메아리 삭제에 실패했습니다.');
            console.error('삭제 실패:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };
    // Mock data - in a real app, you'd fetch this based on the ID
    // const echoData = {
    //     id: id,
    //     type: '이미지',
    //     status: '활성',
    //     reportCount: 1,
    //     content: '[이미지] 덕수궁의 아름다운 석조전',
    //     location: '덕수궁',
    //     author: '이서영',
    //     timestamp: '2024-01-15 13:45',
    //     likes: 45,
    //     views: 289,
    //     comments: 1,
    //     image_key: 
    // };

    if (!echoData) {
        return (
            <div className="space-y-6">
                <div>
                    <Link to="/ar-echo" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                        <ArrowLeftIcon />
                        <span className="ml-2">목록으로 돌아가기</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">AR 메아리 상세 정보</h1>
                    <p className="text-md text-gray-500">ID: {id}</p>
                </div>
                <div className="bg-white p-6 shadow rounded-lg text-center text-gray-500">데이터를 불러오는 중입니다...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link to="/ar-echo" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    <ArrowLeftIcon />
                    <span className="ml-2">목록으로 돌아가기</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">AR 메아리 상세 정보</h1>
                <p className="text-md text-gray-500">ID: {id}</p>
            </div>

            {/* Main Content */}
            <div className="bg-white p-6 shadow rounded-lg">
                <div className="flex flex-col md:flex-row md:space-x-8">
                    {/* Left: Image */}
                    <div className="md:w-1/3 flex-shrink-0">
                        {imageUrl ? (
                            <img src={imageUrl} alt="AR Echo" className="w-full h-auto object-cover rounded-lg" />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                이미지를 불러오는 중...
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="md:w-2/3 mt-6 md:mt-0">
                        <div className="flex items-center space-x-2">
                             {/* <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">🖼️ {echoData.type}</span> */}
                             {/* <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-teal-100 text-teal-800">{echoData.status}</span>
                             {echoData.reportCount && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">🚨 신고 {echoData.reportCount}건</span>} */}
                        </div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">{echoData?.content}</h2>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                            <span>📍 {typeof echoData?.location === 'object' ? 
                                `위도: ${echoData.location.coordinates?.[1]}, 경도: ${echoData.location.coordinates?.[0]}` : 
                                echoData?.location || '위치 정보 없음'
                            }</span>
                            {/* <span>👤 {echoData.author}</span> */}
                            <span>🕒 {formatDateTime(echoData?.createdAt || '')}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center space-x-6 text-md text-gray-700">
                            {/* <span className="flex items-center font-semibold">👍 {echoData.likes}</span>
                            <span className="flex items-center font-semibold">👁️ {echoData.views}</span> */}
                            {/* {echoData.comments !== undefined && <span className="flex items-center font-semibold">💬 {echoData.comments}</span>} */}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="font-semibold text-gray-800">관리자 조치</h3>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    메아리 삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">메아리 삭제 확인</h3>
                        <p className="text-gray-600 mb-6">
                            정말로 이 메아리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                disabled={isDeleting}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteEcho}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? '삭제 중...' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

export default ArEchoDetailPage;
