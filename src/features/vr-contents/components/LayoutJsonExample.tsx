// src/components/vr/LayoutJsonExample.tsx
import React, { useMemo } from 'react';

export interface LayoutJsonExampleProps {
  title?: string;
  description?: string;
  // 예시 JSON 객체를 반환하는 빌더(부모 컴포넌트에서 placement_groups 중심으로 제공)
  dataBuilder: () => unknown;
  className?: string;
}

// --------- 유틸: 키 변환 (camel only) ----------
const toCamel = (s: string) =>
  s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

function transformKeysDeep(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => transformKeysDeep(v));
  }
  if (obj && typeof obj === 'object') {
    const out: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      const newKey = toCamel(k);
      out[newKey] = transformKeysDeep(obj[k]);
    });
    return out;
  }
  return obj;
}

// --------- 컴포넌트 ----------
const LayoutJsonExample: React.FC<LayoutJsonExampleProps> = ({
  title = '레이아웃 JSON 예시',
  description = '',
  dataBuilder,
  className = '',
}) => {
  const exampleJson = useMemo(() => {
    const raw = dataBuilder();
    const transformed = transformKeysDeep(raw);
    return JSON.stringify(transformed, null, 2);
  }, [dataBuilder]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exampleJson);
      alert('예시 JSON이 클립보드에 복사되었습니다.');
    } catch {
      alert('복사에 실패했어요. 브라우저 권한을 확인하세요.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exampleJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `layout_example_groups_camel.json`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className={`rounded-xl border border-gray-200 bg-gray-50 p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
          >
            복사
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
          >
            JSON 다운로드
          </button>
        </div>
      </div>

      <pre className="max-h-72 overflow-auto rounded-lg bg-black p-3 text-xs leading-5 text-gray-100">
{exampleJson}
      </pre>
    </section>
  );
};

export default LayoutJsonExample;