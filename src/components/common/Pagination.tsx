import { useMemo, useState } from 'react';

type Props = {
  page: number;            // 현재 페이지(1-base)
  pageCount: number;       // 전체 페이지 수
  onChange: (next: number) => void;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function Pagination({ page, pageCount, onChange }: Props) {
  const [leftJumpOpen, setLeftJumpOpen] = useState(false);
  const [rightJumpOpen, setRightJumpOpen] = useState(false);
  const [leftValue, setLeftValue] = useState(String(page));
  const [rightValue, setRightValue] = useState(String(page));

  if (!pageCount || pageCount <= 1) return null;

  const windowLeft = 4;
  const windowRight = 5;
  const windowSize = windowLeft + 1 + windowRight; // 10개 표시

  // 슬라이딩 윈도우 계산
  let start = Math.max(1, page - windowLeft);
  let end = Math.min(pageCount, page + windowRight);

  // 부족분을 앞/뒤로 당겨서 최대한 10개 유지
  const actualSize = end - start + 1;
  if (actualSize < windowSize) {
    const short = windowSize - actualSize;
    // 먼저 뒤쪽 여유부터 확장
    end = Math.min(pageCount, end + short);
    // 그래도 부족하면 앞쪽 확장
    const stillShort = windowSize - (end - start + 1);
    if (stillShort > 0) {
      start = Math.max(1, start - stillShort);
    }
  }

  // 버튼 리스트
  const pages = useMemo(() => {
    const arr: number[] = [];
    for (let p = start; p <= end; p++) arr.push(p);
    return arr;
  }, [start, end]);

  const btn = 'px-3 py-2 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
  const active = 'bg-gray-900 text-white hover:bg-gray-900-gray-900';
  const dots = `${btn} w-10 text-center`;

  const go = (n: number) => onChange(clamp(n, 1, pageCount));

  const JumpBox = ({
    value,
    setValue,
    onSubmit,
    onClose,
  }: {
    side: 'left' | 'right';
    value: string;
    setValue: (v: string) => void;
    onSubmit: () => void;
    onClose: () => void;
  }) => (
    <span className="inline-flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={pageCount}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
          if (e.key === 'Escape') onClose();
        }}
        className="w-20 h-8 px-2 text-sm border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder={`1~${pageCount}`}
        autoFocus
      />
      {/* 돋보기 아이콘 (inline SVG) */}
      <button
        className="p-2 rounded hover:bg-gray-50"
        onClick={onSubmit}
        title="이동"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85h-.017zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </button>
      <button className="p-2 rounded hover:bg-gray-50 text-sm" onClick={onClose}>
        취소
      </button>
    </span>
  );

  return (
    <div className="flex items-center justify-center gap-3 my-2 flex-wrap">
      {/* 처음 / 마지막 */}
      <button className={btn} onClick={() => go(1)} disabled={page === 1}>
        처음
      </button>

      {/* 왼쪽 … (필요할 때만) */}
      {start > 1 && (
        leftJumpOpen ? (
          <JumpBox
            side="left"
            value={leftValue}
            setValue={setLeftValue}
            onSubmit={() => { go(Number(leftValue)); setLeftJumpOpen(false); }}
            onClose={() => setLeftJumpOpen(false)}
          />
        ) : (
          <button className={dots} onClick={() => { setLeftValue(String(page)); setLeftJumpOpen(true); }}>
            …
          </button>
        )
      )}

      {/* 페이지 숫자들 (왼쪽 4, 현재, 오른쪽 5) */}
      {pages.map((p) => (
        <button
          key={p}
          className={`${btn} ${p === page ? active : ''}`}
          onClick={() => go(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {/* 오른쪽 … (필요할 때만) */}
      {end < pageCount && (
        rightJumpOpen ? (
          <JumpBox
            side="right"
            value={rightValue}
            setValue={setRightValue}
            onSubmit={() => { go(Number(rightValue)); setRightJumpOpen(false); }}
            onClose={() => setRightJumpOpen(false)}
          />
        ) : (
          <button className={dots} onClick={() => { setRightValue(String(page)); setRightJumpOpen(true); }}>
            …
          </button>
        )
      )}

      <button className={btn} onClick={() => go(pageCount)} disabled={page === pageCount}>
        마지막
      </button>
    </div>
  );
}