/**
 * JSON 파일 예시
{
  "bundleId": "bundle-001",
  "bundleUrl": "https://cdn.example.com/bundles/bundle-001.assetbundle",
  "prefabs": [
    {
      "id": "prefab-001",
      "name": "AncientStatue",
      "sizeMB": 12.5,
      "tags": ["historical", "statue", "museum"]
    },
    {
      "id": "prefab-002",
      "name": "PromoBanner",
      "sizeMB": 3.2,
      "tags": ["promo", "banner"]
    }
  ],
  "placementGroups": [
    {
      "groupId": "group-001",
      "prefabId": "prefab-001",
      "transforms": [
        {
          "location": { "latitude": 37.5665, "longitude": 126.9780, "altitude": 50 },
          "rotation": { "x": 0, "y": 180, "z": 0 },
          "scale": { "x": 1, "y": 1, "z": 1 }
        },
        {
          "location": { "latitude": 37.5670, "longitude": 126.9790, "altitude": 48 },
          "rotation": { "x": 0, "y": 90, "z": 0 },
          "scale": { "x": 0.8, "y": 0.8, "z": 0.8 }
        }
      ],
      "active": true
    },
    {
      "groupId": "group-002",
      "prefabId": "prefab-002",
      "transforms": [
        {
          "location": { "latitude": 37.5650, "longitude": 126.9760, "altitude": 10 },
          "rotation": { "x": 0, "y": 0, "z": 0 },
          "scale": { "x": 2, "y": 2, "z": 1 }
        }
      ],
      "active": false
    }
  ],
  "name": "Seoul Museum Assets",
  "version": "1.0.0",
  "status": "published",
  "usage": "historical",
  "os": "android",
  "updatedAt": "2025-09-18T12:00:00Z",
  "totalSizeMB": 15.7,
  "tags": ["museum", "history", "art"],
  "description": "서울 박물관 전시용 에셋 번들"
}
*/

export type AssetUsage = "historical" | "promo" | "both";
export type AssetStatus = "draft" | "published" | "archived";
export type AssetOS = "android" | "ios";
export interface Transform3D { location: Location; rotation: Rotation; scale: Scale; }

// --- Primitive Types for 3D Transform ---
export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface Scale {
  x: number;
  y: number;
  z: number;
}


// 프리팹 정의
export interface PrefabDefinition {
  id: string;
  name: string;
  sizeMB: number;
  tags: string[];
}

// 프리팹 배치 그룹 (여러 transform을 한 번에)
export interface PrefabPlacementGroup {
  groupId: string;
  prefabId: string;
  transforms: Transform3D[];
  active?: boolean;
}

export interface AssetBundle {
  bundleId: string;
  bundleUrl?: string;

  // 관계 데이터
  prefabs: PrefabDefinition[];

  // 메타데이터
  name: string;
  version: string;
  status: AssetStatus;
  usage: AssetUsage;
  os: AssetOS;

  // 시간 관련
  updatedAt: string;

  // 크기
  totalSizeMB: number;

  // 부가 정보
  tags: string[];
  description?: string;

  // 추가 필드
  layoutJson: LayoutJson; // 서버에서 내려오는 레이아웃 JSON
  location: {
    type: string; // 보통 "Point"
    coordinates: [number, number, number]; // [lon, lat]
  };
}

export interface LayoutJson {
  bundleId: string;
  bundleUrl?: string;

  // 메타데이터
  name: string;
  os: AssetOS;
  version: string;
  usage: AssetUsage;

  // 부가 정보
  tags: string[];
  description?: string;
  
  mainLocation: Location;

  // 시간 관련
  updatedAt: string;

  // 크기
  totalSizeMB: number;

  // 에셋 관련
  prefabs: PrefabDefinition[];
  placementGroups: PrefabPlacementGroup[];
}

export interface BundleFinalizePayload {
  uploadId: string;
  layoutFile: File;
  name: string;
  version: string;
  usage: AssetUsage;
  os: AssetOS;
  tags: string[];
  description: string;
}

export interface UploadBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: BundleFinalizePayload) => void;
}