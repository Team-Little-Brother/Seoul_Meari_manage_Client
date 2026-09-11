import React from "react";
import { IconButton } from "@/components/common/IconButton";
import { Select } from "@/components/common/Select";
import {
  AssetBundle,
  AssetOS,
  AssetStatus,
  AssetUsage,
} from "@/features/vr-contents/types";
import {
  CubeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/common/Icon";

// --- Table-specific UI Components (Originals - no changes needed) ---
const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <th
    className={`px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${
      className ?? ""
    }`}
  >
    {children}
  </th>
);
const Td: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <td className={`px-4 py-3 text-sm text-gray-800 ${className ?? ""}`}>
    {children}
  </td>
);

const UsageBadge: React.FC<{ usage: AssetUsage }> = ({ usage }) => {
  const map = {
    historical: {
      label: "역사",
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    promo: {
      label: "프로모션",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    both: {
      label: "둘 다",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${map[usage].cls}`}
    >
      {map[usage].label}
    </span>
  );
};
const StatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
  const map = {
    draft: {
      label: "드래프트",
      cls: "bg-gray-100 text-gray-700 border-gray-200",
    },
    published: {
      label: "배포됨",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    archived: {
      label: "보관됨",
      cls: "bg-zinc-100 text-zinc-600 border-zinc-200",
    },
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${map[status].cls}`}
    >
      {map[status].label}
    </span>
  );
};

const OSBadge: React.FC<{ os: AssetOS }> = ({ os }) => {
  const map = {
    android: {
      label: "Android",
      cls: "bg-green-50 text-green-800 border-green-200",
    },
    ios: {
      label: "iOS",
      cls: "bg-stone-100 text-stone-800 border-stone-200",
    },
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[os].cls}`}
    >
      {map[os].label}
    </span>
  );
};

// --- Main Component (Refactored for Responsiveness) ---
interface BundleTableProps {
  bundles: AssetBundle[];
  sortBy: "recent" | "size" | "name";
  onSortChange: (value: "recent" | "size" | "name") => void;
  onPreview: (bundle: AssetBundle) => void;
  onEdit: (bundle: AssetBundle) => void;
  onDelete: (bundle: AssetBundle) => void;
}

const toNumber = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

// 번들 용량(MB) 얻기: totalSizeMB → layoutJson.totalSizeMB 폴백
const getSizeMB = (bundle: AssetBundle): number =>
  toNumber(bundle.layoutJson.totalSizeMB);

// 표기용
const formatSizeMB = (bundle: any): string => {
  const n = getSizeMB(bundle);
  return n > 0 ? n.toFixed(1) : '—';
};

const BundleTable: React.FC<BundleTableProps> = ({
  bundles,
  sortBy,
  onSortChange,
  onPreview,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="text-sm text-gray-600">총 {bundles.length}개 번들</div>
        <Select
          value={sortBy}
          onChange={(v) => onSortChange(v as any)}
          options={[
            { value: "recent", label: "최근 수정" },
            { value: "size", label: "용량" },
            { value: "name", label: "이름" },
          ]}
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 md:divide-y-0">
        <thead className="hidden bg-gray-50 md:table-header-group">
          <tr>
            <Th>번들 이름</Th>
            <Th>버전</Th>
            <Th>번들 ID</Th>
            <Th>프리팹 수</Th>
            <Th className="text-right">크기(MB)</Th>
            <Th>용도</Th>
            <Th>상태</Th>
            <Th>OS</Th>
            <Th>수정</Th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {bundles.map((bundle) => (
            <tr
              key={bundle.bundleId}
              className="block border-b hover:bg-gray-50 md:table-row md:border-b-0"
            >
              {/* Main "Card" Title */}
              <Td className="pt-4 md:pt-3">
                <div className="flex items-center gap-3">
                  <CubeIcon />
                  <div>
                    <div className="font-bold text-gray-900 md:font-medium">
                      {bundle.name}
                    </div>
                    <div
                      className="max-w-48 truncate text-xs text-gray-500"
                      title={bundle.bundleUrl}
                    >
                      {bundle.bundleUrl}
                    </div>
                  </div>
                </div>
              </Td>

              {/* Data cells with responsive labels */}
              <td
                data-label="버전"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right md:text-left">{bundle.version}</div>
              </td>
              <td
                data-label="번들 ID"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right md:text-left">
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                    {bundle.bundleId}
                  </code>
                </div>
              </td>
              <td
                data-label="프리팹 수"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right md:text-center">
                  {bundle.layoutJson.prefabs.length}
                </div>
              </td>
              <td
                data-label="크기(MB)"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right tabular-nums md:text-right">
                  {formatSizeMB(bundle)}
                </div>
              </td>
              <td
                data-label="용도"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right md:text-left">
                  <UsageBadge usage={bundle.usage} />
                </div>
              </td>
              <td
                data-label="상태"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right md:text-left">
                  <StatusBadge status={bundle.status} />
                </div>
              </td>
              <td
                data-label="OS"
                className="block px-4 py-2 before:float-left before:font-bold before:content-[attr(data-label)] md:table-cell md:px-3 md:py-3 md:before:content-['']"
              >
                <div className="text-right md:text-left">
                  <OSBadge os={bundle.os} />
                </div>
              </td>

              {/* Actions */}
              <td className="block px-4 pb-4 pt-2 md:table-cell md:p-3">
                <div className="flex items-center justify-end gap-2 md:justify-start">
                  <IconButton
                    title="미리보기"
                    onClick={() => onPreview(bundle)}
                  >
                    <EyeIcon />
                  </IconButton>
                  <IconButton title="메타편집" onClick={() => onEdit(bundle)}>
                    <PencilIcon />
                  </IconButton>
                  <IconButton
                    title="삭제"
                    danger
                    onClick={() => onDelete(bundle)}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BundleTable;
