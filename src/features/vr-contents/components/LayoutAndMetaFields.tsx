import React from 'react';
import FileDropZone from '@/components/common/FileDropZone';
import { LabeledInput, LabeledTextarea, FormRow } from '@/components/common/FormField';
import { Select } from '@/components/common/Select';
import TagInput from '@/components/common/TagInput';
import { AssetOS, AssetUsage, LayoutJson } from '../types';

// =================================================================
// 레이아웃 및 메타데이터
// =================================================================
interface LayoutAndMetaFieldsProps {
  layoutFile: File | null;
  setLayoutFile: (f: File | null) => void;

  name: string;
  setName: (v: string) => void;

  version: string;
  setVersion: (v: string) => void;

  usage: AssetUsage;
  setUsage: (v: AssetUsage) => void;

  os: AssetOS;
  setOs: (v: AssetOS) => void;

  tags: string;
  setTags: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  latitude: number;
  setLatitude: (v: number) => void;

  longitude: number;
  setLongitude: (v: number) => void;

  altitude: number;
  setAltitude: (v: number) => void;
}

function isLayoutJson(v: unknown): v is LayoutJson {
  if (typeof v !== 'object' || v === null) return false;
  return true;
}

const LayoutAndMetaFields: React.FC<LayoutAndMetaFieldsProps> = ({
  setLayoutFile,
  name, setName,
  version, setVersion,
  usage, setUsage,
  os, setOs,
  tags, setTags,
  description, setDescription,
  latitude, setLatitude,
  longitude, setLongitude,
  altitude, setAltitude,
}) => {
  // 컴포넌트 내부에 핸들러 추가
  const onLayoutJsonSelected = async (files: File[] | null) => {
    const file = files?.[0] || null;
    setLayoutFile(file);

    if (!file) return;

    try {
      const text = await file.text(); // UTF-8 기본
      const parsed = JSON.parse(text) as unknown;

      if (!isLayoutJson(parsed)) {
        // 여기서 토스트/알림으로 사용자에게 알려도 좋음
        console.warn('레이아웃 JSON 스키마가 예상과 다릅니다.');
        return;
      }

      // 안전 변환 유틸
      const toNum = (n: unknown): number | undefined => {
        const v = typeof n === 'string' ? Number(n) : n;
        return typeof v === 'number' && !Number.isNaN(v) ? v : undefined;
      };

      // 필드 매핑 (존재할 때만 덮어쓰기)
      if (parsed.name) setName(parsed.name);
      if (parsed.version) setVersion(parsed.version);
      if (parsed.description) setDescription(parsed.description);
      if (parsed.usage) setUsage(parsed.usage as AssetUsage);
      if (parsed.os) setOs(parsed.os as AssetOS);

      // tags: string[] -> 콤마 구분 문자열
      if (Array.isArray(parsed.tags)) {
        setTags(parsed.tags.join(', '));
      }

      // mainLocation 매핑
      const lat = toNum(parsed.mainLocation.latitude);
      const lon = toNum(parsed.mainLocation.longitude);
      const altitude = toNum(parsed.mainLocation.altitude);

      if (lat !== undefined) setLatitude(lat);
      if (lon !== undefined) setLongitude(lon);
      if (altitude !== undefined) setAltitude(altitude);

      // 필요하면 updatedAt, totalSizeMB 등도 별도 상태에 반영 가능
    } catch (e) {
      console.error('레이아웃 JSON 파싱 실패:', e);
      // 사용자 알림(UI 토스트 등) 처리 권장
    }
  };

  return (
    <div className="p-3 border rounded-md bg-gray-50/50">
      <p className="text-sm font-semibold text-gray-700">2. 레이아웃 및 메타데이터</p>
      <div className="pt-2 space-y-4">
        <FileDropZone
          label="레이아웃 JSON"
          required
          inputId="layout-file-upload"
          accept=".json"
          onChange={(f) => onLayoutJsonSelected(f)}
          placeholder="배치 정보가 담긴 .json 파일"
        />

        <FormRow>
          <LabeledInput
            label="번들 이름"
            required
            id="bundle-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 경복궁_주요_건물군"
          />
          <LabeledInput
            label="버전"
            required
            id="bundle-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="예: 1.0.0"
          />
        </FormRow>

        <FormRow>
          <LabeledInput
            label="주요 위도 (Latitude)"
            required
            id="bundle-latitude"
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            placeholder="예: 37.579617"
          />
          <LabeledInput
            label="주요 경도 (Longitude)"
            required
            id="bundle-longitude"
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            placeholder="예: 126.977041"
          />
          <LabeledInput
            label="주요 고도 (Altitude)"
            id="bundle-altitude"
            type="number"
            value={altitude}
            onChange={(e) => setAltitude(parseFloat(e.target.value))}
            placeholder="예: 30.5"
          />
        </FormRow>

        <FormRow>
          <Select
            label="용도"
            value={usage}
            onChange={(v) => setUsage(v as AssetUsage)}
            options={[
              { value: 'historical', label: '역사' },
              { value: 'promo', label: '프로모션' },
              { value: 'both', label: '둘 다' },
            ]}
          />
          <Select
            label="OS"
            value={os}
            onChange={(v) => setOs(v as AssetOS)}
            options={[
              { value: 'android', label: 'Android' },
              { value: 'ios', label: 'iOS' },
            ]}
          />
        </FormRow>

        <TagInput value={tags} onChange={setTags} />

        <LabeledTextarea
          label="설명"
          id="bundle-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="이 번들에 포함된 에셋이나 주요 변경 사항에 대해 설명합니다."
        />
      </div>
    </div>
  );
};

export default LayoutAndMetaFields;