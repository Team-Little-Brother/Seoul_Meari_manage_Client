import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';


interface ArEchoCardProps {
    id: number;
    writer : string,
    content: string;
    createdAt : string,
    location: string | { type: string; coordinates: number[] };
    image_key : string
}

    const formatLocation = (loc: ArEchoCardProps['location']) => {
        if (!loc) return '';
        if (typeof loc === 'string') return loc;
        if (Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
            const [lng, lat] = loc.coordinates;
            return `${lat}, ${lng}`;
        }
        return '';
    };

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

const ArEchoCard: React.FC<ArEchoCardProps> = (props) => {
    const { id, writer, content, createdAt, location } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="bg-white p-5 shadow rounded-lg">
            <div className="flex justify-between items-start">
                {/* Left Side: Tags and Content */}
                <div>
                    <p className="mt-3 text-gray-800">{content}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span>📍 {formatLocation(location)}</span>
                        {writer && <span>👤 {writer}</span>}
                        <span>🕒 {formatDateTime(createdAt)}</span>
                    </div>
                </div>
                {/* Right Side: Actions */}
                <div className="flex items-center space-x-3 relative" ref={menuRef}>
                    <Link to={`/ar-echo/${id}`} className="text-sm text-gray-600 hover:text-gray-900 flex items-center bg-gray-100 px-3 py-1 rounded-md">👁️ 보기</Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-sm text-gray-600 hover:text-gray-900">...</button>
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <ul className="py-1">
                                <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">수정</a></li>
                                <li><a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">빠른 삭제</a></li>
                                <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">사용자 제재</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArEchoCard;
