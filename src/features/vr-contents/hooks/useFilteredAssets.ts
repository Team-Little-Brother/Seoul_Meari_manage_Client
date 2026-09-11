import { useMemo } from 'react';
import { AssetStatus, AssetUsage, AssetBundle } from '../../vr-contents/types';

/**
 * asset 목록을 받아 각종 필터링 및 정렬 로직을 적용하는 커스텀 훅
 */
/**
 * AssetBundle 목록을 받아 각종 필터링 및 정렬 로직을 적용하는 커스텀 훅
 * (기존 useFilteredAssets -> useFilteredBundles로 변경)
 */
export const useFilteredBundles = (
  bundles: AssetBundle[],
  query: string,
  usage: AssetUsage | 'all',
  status: AssetStatus | 'all',
  sortBy: 'recent' | 'size' | 'name'
) => {
  return useMemo(() => {
    const lowerQuery = query.toLowerCase();

    // 1. 필터링
    let result = bundles.filter(bundle => {
      // 용도(usage) 필터링
      if (usage !== "all" && bundle.usage !== usage) {
        return false;
      }
      
      // 상태(status) 필터링
      if (status !== "all" && bundle.status !== status) {
        return false;
      }

      // 검색어(query) 필터링
      if (lowerQuery) {
        // 번들 자체의 정보 (이름, ID, 태그)에서 검색
        const isInBundle = bundle.name.toLowerCase().includes(lowerQuery) ||
                           bundle.bundleId.toLowerCase().includes(lowerQuery) ||
                           bundle.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

        // 번들 내부 프리팹들의 정보 (이름, 태그)에서 검색
        const isInPrefabs = bundle.prefabs.some(prefab => 
          prefab.name.toLowerCase().includes(lowerQuery) || 
          prefab.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );

        // 둘 중 하나라도 해당되지 않으면 목록에서 제외
        if (!isInBundle && !isInPrefabs) return false;
      }
      
      return true;
    });

    // 2. 정렬
    switch (sortBy) {
      case "size":
        result.sort((a, b) => b.totalSizeMB - a.totalSizeMB);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        break;
      default: // 'recent'
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }
    return result;
  }, [bundles, query, usage, status, sortBy]);
};