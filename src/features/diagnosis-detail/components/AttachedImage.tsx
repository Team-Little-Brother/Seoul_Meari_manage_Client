import { getPresignedUrl } from '@/api/s3API';
import { useState, useEffect } from 'react';

interface AttachedImageProps {
    complaintData: any;
}

// const createPresignedUrl = async (s3_url: string) => {
//     const response = await fetch(`http://localhost:3000/complaints/presigned-url`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ "S3_url": s3_url }),
//     });
//     const data = await response.json();
//     return data.presigned_url;
// }

const AttachedImage = ({ complaintData }: AttachedImageProps) => {
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const hasImage = complaintData.S3_url && complaintData.S3_url.trim() !== '';

    useEffect(() => {
        if (hasImage) {
            const getPresignedUrlFunc = async () => {
                setLoading(true);
                try {
                    const url = await getPresignedUrl(complaintData.S3_url);
                    setPresignedUrl(url);
                } catch (error) {
                    console.error('Presigned URL 생성 실패:', error);
                } finally {
                    setLoading(false);
                }
            };
            getPresignedUrlFunc();
        }
    }, [complaintData.S3_url, hasImage]);

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PhotographIcon />
                <span className="ml-2">첨부 이미지</span>
            </h3>
            
            {hasImage ? (
                <div className="mt-4">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-center text-gray-500">
                                <div>
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="mt-2 text-sm">이미지 로딩 중...</p>
                                </div>
                            </div>
                        ) : presignedUrl ? (
                            <img 
                                src={presignedUrl} 
                                alt="민원 이미지" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = `
                                            <div class="flex items-center justify-center h-full text-center text-gray-500">
                                                <div>
                                                    <svg class="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p class="mt-2 text-sm">이미지 로드 실패</p>
                                                </div>
                                            </div>
                                        `;
                                    }
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-gray-500">
                                <div>
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="mt-2 text-sm">URL 생성 중...</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button 
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                        onClick={() => window.open(presignedUrl || complaintData.S3_url, '_blank')}
                        disabled={!presignedUrl}
                    >
                        <ExternalLinkIcon />
                        <span className="ml-2">원본 보기</span>
                    </button>
                </div>
            ) : (
                <div className="mt-4 aspect-w-1 aspect-h-1 bg-gray-100 rounded-md flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <ImageIcon />
                        <p className="mt-2 text-sm">첨부 이미지 없음</p>
                        <p className="text-xs">이 민원에는 이미지가 첨부되지 않았습니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Icons
const PhotographIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

export default AttachedImage;
