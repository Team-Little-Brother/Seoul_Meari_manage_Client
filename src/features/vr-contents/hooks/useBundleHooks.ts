import { useMemo } from 'react';
import { AssetBundle, AssetStatus, AssetUsage } from '../../vr-contents/types';

// 안전 변환 헬퍼들
const toNumber = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};
const getSizeMB = (b: AssetBundle): number =>
  toNumber((b as any)?.totalSizeMB ?? (b as any)?.layoutJson?.totalSizeMB);

const getUpdatedAtMs = (b: AssetBundle): number => {
  const v =
    (b as any)?.updatedAt ??
    (b as any)?.createdAt ??             // 일부 응답엔 createdAt만 존재
    (b as any)?.layoutJson?.updatedAt;   // layoutJson 내부 폴백
  const t = v ? new Date(v as string).getTime() : NaN;
  return Number.isFinite(t) ? t : 0;
};

export const useBundleStats = (bundles: AssetBundle[]) => {
  return useMemo(() => {
    const totalBundles = bundles.length;

    const historicalScenes = bundles.filter(
      b => b.usage === 'historical' || b.usage === 'both'
    ).length;

    const promoScenes = bundles.filter(
      b => b.usage === 'promo' || b.usage === 'both'
    ).length;

    const totalStorage = bundles.reduce((sum, b) => sum + getSizeMB(b), 0);

    return [
      { title: '총 번들', value: String(totalBundles) },
      { title: '역사 씬', value: String(historicalScenes) },
      { title: '프로모션', value: String(promoScenes) },
      { title: '스토리지(MB)', value: Math.round(totalStorage).toLocaleString() },
    ];
  }, [bundles]);
};

export const useFilteredBundles = (
  bundles: AssetBundle[],
  query: string,
  usage: AssetUsage | 'all',
  status: AssetStatus | 'all',
  sortBy: 'recent' | 'size' | 'name'
) => {
  return useMemo(() => {
    let filtered = [...bundles];
    const lowerQuery = query.toLowerCase();

    // 1) Filter
    filtered = filtered.filter(bundle => {
      if (usage !== 'all' && bundle.usage !== usage) return false;
      if (status !== 'all' && bundle.status !== status) return false;

      if (lowerQuery) {
        const name = (bundle.name ?? '').toLowerCase();
        const id = (bundle.bundleId ?? '').toLowerCase();

        const isInBundle = name.includes(lowerQuery) || id.includes(lowerQuery);

        // prefabs/태그가 없을 수도 있으니 옵셔널 체이닝 + 기본값
        const isInPrefabs = (bundle.prefabs ?? []).some(prefab => {
          const pn = (prefab?.name ?? '').toLowerCase();
          const tags = (prefab?.tags ?? []).map(t => (t ?? '').toLowerCase());
          return pn.includes(lowerQuery) || tags.some(t => t.includes(lowerQuery));
        });

        if (!isInBundle && !isInPrefabs) return false;
      }
      return true;
    });

    // 2) Sort
    switch (sortBy) {
      case 'size':
        filtered.sort((a, b) => getSizeMB(b) - getSizeMB(a));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => getUpdatedAtMs(b) - getUpdatedAtMs(a));
        break;
    }

    return filtered;
  }, [bundles, query, usage, status, sortBy]);
};