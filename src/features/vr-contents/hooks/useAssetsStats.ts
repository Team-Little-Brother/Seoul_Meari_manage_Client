import { useMemo } from 'react';
import { AssetBundle } from '../../vr-contents/types';

/**
 * asset 목록을 받아 통계 데이터를 계산하는 커스텀 훅
 */
export const useBundleStats = (bundles: AssetBundle[]) => {
  return useMemo(() => {
    if (!bundles || bundles.length === 0) {
      return [
        { title: "총 번들", value: "0" },
        { title: "스토리지(MB)", value: "0.0" },
        { title: "역사 씬", value: "0" },
        { title: "프로모션", value: "0" },
      ];
    }

    const total = bundles.length;
    // 'usage'는 AssetBundle 레벨에 있으므로 여기서 필터링합니다.
    const historical = bundles.filter((b) => b.usage === "historical" || b.usage === "both").length;
    const promo = bundles.filter((b) => b.usage === "promo" || b.usage === "both").length;
    // 'totalSizeMB'를 합산합니다.
    const storage = bundles.reduce((acc, b) => acc + b.layoutJson.totalSizeMB, 0);

    return [
      { title: "총 번들", value: String(total) },
      { title: "스토리지(MB)", value: storage.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) },
      { title: "역사 씬", value: String(historical) },
      { title: "프로모션", value: String(promo) },
    ];
  }, [bundles]);
};