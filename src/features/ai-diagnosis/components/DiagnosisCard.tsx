import { resolveComplaint } from '@/api';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type Status = '대기' | '해결됨';

interface DiagnosisCardProps {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  confidence: number;
  status: Status;
  image: string;
}

const getStatusColor = (status: Status) => {
  if (status === '해결됨') return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' };
  return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' };
};

const Tag: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
    {children}
  </span>
);

const DiagnosisCard: React.FC<DiagnosisCardProps> = (props) => {
  const { id, title, description, timestamp, location, confidence } = props;
  const [status, setStatus] = useState<Status>(props.status);
  const [loading, setLoading] = useState(false);
  const colors = getStatusColor(status);

  const handleResolve = async () => {
    if (status === '해결됨' || loading) return;
    setLoading(true);

    // 낙관적 업데이트
    const prev = status;
    setStatus('해결됨');

    try {
      await resolveComplaint(id);
    } catch (e) {
      // 실패 시 롤백
      setStatus(prev);
      console.error(e);
      alert('상태 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-5 rounded-lg border ${colors.bg} ${colors.border}`}>
      {/* Card Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <span className={`${colors.text}`}><AlertIcon status={status} /></span>
          <h4 className={`text-md font-bold ${colors.text}`}>{title}</h4>
        </div>
        <div className="flex space-x-2">
          <Tag className="bg-white border border-gray-200 text-gray-600">{status}</Tag>
        </div>
      </div>

      {/* Card Body */}
      <div className="mt-3 pl-9">
        <p className="text-sm text-gray-700">{description}</p>
        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
          <span>🕒 {timestamp}</span>
          <span>📍 {location}</span>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          <span>신뢰도: {confidence}%</span>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="mt-4 pl-9 flex items-center space-x-2">
        <Link to={`/ai-diagnosis/${id}`} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
          <EyeIcon /> <span className="ml-2">상세보기</span>
        </Link>
        <button
          onClick={handleResolve}
          disabled={status === '해결됨' || loading}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-md flex items-center
            ${status === '해결됨' ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
        >
          <CheckIcon /> <span className="ml-2">{loading ? '처리 중...' : '해결완료'}</span>
        </button>
      </div>
    </div>
  );
};

const AlertIcon: React.FC<{ status: Status }> = ({ status }) => {
    if (status === '해결됨') return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    return <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;

export default DiagnosisCard;
