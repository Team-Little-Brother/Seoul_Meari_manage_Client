import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { getEchoList } from '@/api';
import AiStatCard from '../features/ai-diagnosis/components/AiStatCard';
import ArEchoFilterPanel from '../features/ar-echo/components/ArEchoFilterPanel';
import ArEchoCard from '../features/ar-echo/components/ArEchoCard';
import { Spinner } from '@/components/common/Spinner';
import seoulMap from '@/assets/map_0.png';
import Pagination from '@/components/common/Pagination';

// ==================================================================================
// AR 메아리 페이지만을 위한 독립적인 지도 컴포넌트
// ==================================================================================
interface EchoMapProps {
  echos: { id: string; latitude: number; longitude: number; }[];
}

const SEOUL_BOUNDS = {
  north: 37.701, south: 37.413, west: 126.734, east: 127.269,
};

const convertCoordsToPosition = (lat: number, lng: number, imageRect: DOMRect) => {
  const topPercent = ((SEOUL_BOUNDS.north - lat) / (SEOUL_BOUNDS.north - SEOUL_BOUNDS.south));
  const leftPercent = ((lng - SEOUL_BOUNDS.west) / (SEOUL_BOUNDS.east - SEOUL_BOUNDS.west));
  if (topPercent < 0 || topPercent > 1 || leftPercent < 0 || leftPercent > 1) return null;
  return { top: topPercent * imageRect.height, left: leftPercent * imageRect.width };
};

const EchoMap: React.FC<EchoMapProps> = ({ echos }) => {
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
          height = container.offsetHeight;
          width = height * imgRatio;
          x = (container.offsetWidth - width) / 2;
          y = 0;
        } else {
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
        <LocationMarkerIcon />
        <span className="ml-2">AR 메아리 지도</span>
      </h3>
      <div 
        ref={containerRef}
        className="mt-4 h-[500px] bg-contain bg-center bg-no-repeat rounded-md relative bg-gray-100"
        style={{ backgroundImage: `url(${seoulMap})` }}
      >
        {imageRect && echos.map((echo) => {
          const position = convertCoordsToPosition(echo.latitude, echo.longitude, imageRect);
          if (!position) return null;
          return (
            <div
              key={echo.id}
              className="absolute w-3 h-3 bg-teal-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
              style={{ top: position.top, left: position.left, transform: `translate(${imageRect.x}px, ${imageRect.y}px)` }}
              title={`ID: ${echo.id}\n위치: ${echo.latitude}, ${echo.longitude}`}
            />
          );
        })}
      </div>
    </div>
  );
};
// ==================================================================================
// 페이지 메인 컴포넌트
// ==================================================================================
const ArEchoManagementPage = () => {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [echoData, setEchoData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState(1);
    const [limit] = useState(500);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEchoData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEchoList({ page, limit, search: searchTerm });
                setEchoData(data.items || []);
                setMeta(data.meta);
            } catch (err) {
                setError('메아리 데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        loadEchoData();
    }, [page, limit, searchTerm]);

    const mapData = useMemo(() => {
    return echoData
      .map((echo) => ({
        id: echo.id,
        latitude: echo.location?.coordinates?.[1],
        longitude: echo.location?.coordinates?.[0],
      }))
      .filter((e) => e.latitude != null && e.longitude != null);
  }, [echoData]);

  const todayCreatedCount = meta?.todayCount ?? 0;

  const stats = [
    {
      title: '총 메아리',
      value: (meta?.total ?? 0).toString(),
      change: `+${todayCreatedCount}`,
      icon: <CollectionIcon />,
      iconBgColor: 'bg-green-100 text-green-600',
    },
    {
      title: '위치 있는 메아리',
      value: mapData.length.toString(),
      change: '',
      icon: <LocationMarkerIcon />,
      iconBgColor: 'bg-teal-100 text-teal-600',
    },
    {
      title: '신고된 메아리',
      value: '0',
      change: '',
      icon: <ExclamationCircleIcon />,
      iconBgColor: 'bg-red-100 text-red-600',
    },
    {
      title: '오늘 생성',
      value: todayCreatedCount.toString(),
      change: ``,
      icon: <CalendarIcon />,
      iconBgColor: 'bg-orange-100 text-orange-600',
    },
  ];

  const onSearchChange = (v: string) => {
    setPage(1);
    setSearchTerm(v);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AR 메아리 관리</h1>
        <p className="text-md text-gray-500 mt-1">사용자가 생성한 AR 콘텐츠 관리</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <AiStatCard key={item.title} {...item} />
        ))}
      </div>

      <ArEchoFilterPanel
        activeView={view}
        onViewChange={setView}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

                  {meta && meta.pageCount > 1 && (
              <Pagination
                page={meta.page}
                pageCount={meta.pageCount}
                onChange={(next) => setPage(next)}
              />
            )}

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {view === 'list' ? (
            <div className="space-y-4">
              {echoData.length > 0 ? (
                echoData.map((echo) => <ArEchoCard key={echo.id} {...echo} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? '검색 결과가 없습니다.' : '표시할 메아리가 없습니다.'}
                  </p>
                </div>
              )}

            {meta && meta.pageCount > 1 && (
              <Pagination
                page={meta.page}
                pageCount={meta.pageCount}
                onChange={(next) => setPage(next)}
              />
            )}
            </div>
          ) : (
            <EchoMap echos={mapData} />
          )}
        </>
      )}
    </div>
  );
};

// ==================================================================================
// 아이콘 컴포넌트
// ==================================================================================
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

export default ArEchoManagementPage;