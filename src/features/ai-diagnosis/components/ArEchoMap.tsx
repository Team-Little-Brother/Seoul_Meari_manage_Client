import React, { useState, useRef, useLayoutEffect } from 'react';
import seoulMap from '@/assets/map_0.png';

interface ArEchoMapProps {
  complaints: any[];
}

// 서울시의 보다 정밀한 위도/경도 경계
const SEOUL_BOUNDS = {
  north: 37.701,
  south: 37.413,
  west: 126.734,
  east: 127.269,
};

// 위도/경도를 이미지 위의 픽셀 위치로 변환하는 함수
const convertCoordsToPosition = (lat: number, lng: number, imageRect: DOMRect) => {
  const topPercent = ((SEOUL_BOUNDS.north - lat) / (SEOUL_BOUNDS.north - SEOUL_BOUNDS.south));
  const leftPercent = ((lng - SEOUL_BOUNDS.west) / (SEOUL_BOUNDS.east - SEOUL_BOUNDS.west));

  // 경계 밖 좌표는 표시하지 않음
  if (topPercent < 0 || topPercent > 1 || leftPercent < 0 || leftPercent > 1) {
    return null;
  }
  
  const top = topPercent * imageRect.height;
  const left = leftPercent * imageRect.width;

  return { top, left };
};

const ArEchoMap: React.FC<ArEchoMapProps> = ({ complaints }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const calculateImageRect = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRatio = container.offsetWidth / container.offsetHeight;
      
      const img = new Image();
      img.src = seoulMap;
      img.onload = () => {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let width, height, x, y;

        if (containerRatio > imgRatio) {
          // 컨테이너가 이미지보다 넓은 경우 (높이에 맞춰짐)
          height = container.offsetHeight;
          width = height * imgRatio;
          x = (container.offsetWidth - width) / 2;
          y = 0;
        } else {
          // 이미지가 컨테이너보다 넓거나 같은 경우 (너비에 맞춰짐)
          width = container.offsetWidth;
          height = width / imgRatio;
          x = 0;
          y = (container.offsetHeight - height) / 2;
        }
        setImageRect(new DOMRect(x, y, width, height));
      };
    };

    calculateImageRect();
    window.addEventListener('resize', calculateImageRect);
    return () => window.removeEventListener('resize', calculateImageRect);
  }, []);

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <MapIcon />
        <span className="ml-2">도시 민원 지도</span>
      </h3>
      <div 
        ref={containerRef}
        className="mt-4 h-[500px] bg-contain bg-center bg-no-repeat rounded-md relative bg-gray-100"
        style={{ backgroundImage: `url(${seoulMap})` }}
      >
        {imageRect && complaints.map((c) => {
          if (c.latitude && c.longitude) {
            const position = convertCoordsToPosition(c.latitude, c.longitude, imageRect);
            if (!position) return null;

            return (
              <div
                key={c.complaint_id}
                className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{ top: position.top, left: position.left, transform: `translate(${imageRect.x}px, ${imageRect.y}px)` }}
                title={`ID: ${c.complaint_id}\n위치: ${c.latitude}, ${c.longitude}`}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default ArEchoMap;
