import React, { useEffect, useState } from 'react';
import AiStatCard from '@/features/ai-diagnosis/components/AiStatCard';
import { AssetBundle, AssetStatus, AssetUsage } from '@/features/vr-contents/types';
import { HistoricIcon, MegaphoneIcon, PackageIcon, SearchIcon, StorageIcon, UploadIcon } from '@/components/common/Icon';
import { Select } from '@/components/common/Select';
import BundleTable from '@/features/vr-contents/components/AssetTable';
import UploadBundleModal from '@/features/vr-contents/components/UploadBundleModal';
import { useFilteredBundles } from '@/features/vr-contents/hooks/useBundleHooks';
import { useBundleStats } from '@/features/vr-contents/hooks/useAssetsStats';
import { getBundles } from '@/api/vrContentAPI';

const VRContentsPage: React.FC = () => {
  // --- States ---
  const [q, setQ] = useState("");
  const [usage, setUsage] = useState<AssetUsage | "all">("all");
  const [status, setStatus] = useState<AssetStatus | "all">("all");
  const [sortBy, setSortBy] = useState<'recent' | 'size' | 'name'>("recent");
  const [bundles, setBundles] = useState<AssetBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [refetchTrigger] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchBundles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBundles({
          q: q || undefined,
          usage,
          status,
          sortBy,
          page: pagination.page,
          limit: pagination.limit
        });
        setBundles(response.data);
        console.log(response.data);
        setPagination(prev => ({ ...prev, total: response.total }));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchBundles();
    }, 300);

    return () => clearTimeout(timerId);

  }, [q, usage, status, sortBy, pagination.page, pagination.limit, refetchTrigger]);

  // --- Memos (Computed Data) ---
  const filteredBundles = useFilteredBundles(bundles, q, usage, status, sortBy); // hook 변경
  const bundleStats = useBundleStats(bundles); // hook 변경
  const statsWithIcons = bundleStats.map(stat => {
      const iconMap = {
          "총 번들": { icon: <PackageIcon />, iconBgColor: "bg-blue-100 text-blue-600" },
          "스토리지(MB)": { icon: <StorageIcon />, iconBgColor: "bg-indigo-100 text-indigo-600" },
          "역사 씬": { icon: <HistoricIcon />, iconBgColor: "bg-purple-100 text-purple-600" },
          "프로모션": { icon: <MegaphoneIcon />, iconBgColor: "bg-yellow-100 text-yellow-600" },
      };
      return { ...stat, ...iconMap[stat.title as keyof typeof iconMap], change: null };
  });

  // --- Handlers ---
  const handleUploadBundle = () => setIsModalOpen(true);
  const handleUploadSubmit = () => {
    setIsModalOpen(false);
  };
  const handlePreviewBundle = (bundle: AssetBundle) => alert(`미리보기: ${bundle.name}`);
  const handleEditBundle = (bundle: AssetBundle) => alert(`메타 편집: ${bundle.name}`);
  const handleDeleteBundle = (bundle: AssetBundle) => alert(`삭제: ${bundle.name}`);

  // --- Render ---
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">VR 콘텐츠 관리</h1>
        <p className="text-md text-gray-500 mt-1">역사 재현 및 기업 프로모션용 3D 에셋 번들을 관리합니다.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsWithIcons.map((item) => <AiStatCard key={item.title} {...item} change={null} />)}
      </div>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 items-end">
        <div className="md:col-span-3"><Select label="용도" value={usage} onChange={(v) => setUsage(v as any)} options={[{ value: "all", label: "전체" }, { value: "historical", label: "역사" }, { value: "promo", label: "프로모션" }, { value: "both", label: "둘 다" }]} /></div>
        <div className="md:col-span-3"><Select label="상태" value={status} onChange={(v) => setStatus(v as any)} options={[{ value: "all", label: "전체" }, { value: "draft", label: "드래프트" }, { value: "published", label: "배포됨" }, { value: "archived", label: "보관됨" }]} /></div>
        <div className="md:col-span-4">
          <label className="block text-sm text-gray-600 mb-1">검색</label>
          <div className="relative"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="번들 이름, 키, 내부 에셋 태그…" className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pl-10 outline-none focus:ring-2 focus:ring-gray-900" /><div className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><SearchIcon /></div></div>
        </div>
        <div className="md:col-span-2"><div className="flex md:justify-end"><button onClick={handleUploadBundle} className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 py-2 ring-1 ring-gray-300 hover:bg-gray-50"><UploadIcon /><span className="whitespace-nowrap">번들 업로드</span></button></div></div>
      </div>

      {/* Table */}
      {isLoading && <div className="text-center p-10">데이터를 불러오는 중입니다...</div>}
      {error && <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">오류: {error}</div>}
      {!isLoading && !error && (
        <BundleTable
          bundles={filteredBundles}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onPreview={handlePreviewBundle}
          onEdit={handleEditBundle}
          onDelete={handleDeleteBundle}
        />
      )}
      
      {/* 모달은 이 div 안에 있어도 position: fixed 속성 때문에 화면 전체에 올바르게 표시됩니다. */}
      <UploadBundleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};

export default VRContentsPage;