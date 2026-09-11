// src/components/ui/Select.tsx
import React, { useState, useRef, useEffect } from "react";

// 아이콘은 이전과 동일하게 사용합니다.
const SelectorIcon = () => (
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M7 8.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const CheckIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  // 외부 클릭 감지를 위한 useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // selectRef.current가 존재하고, 클릭된 요소가 selectRef.current 내부에 없을 때
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  const handleOptionClick = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    // 컴포넌트의 최상위 div에 ref를 연결하여 DOM 요소를 참조
    <div className="relative" ref={selectRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* 버튼을 클릭하면 isOpen 상태가 토글됨 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full h-10 pl-4 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm
          cursor-default outline-none
          transition-colors duration-200
          hover:border-indigo-400
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">{selectedOption?.label}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <SelectorIcon />
        </span>
      </button>

      {/* isOpen이 true일 때만 드롭다운 메뉴를 렌더링 */}
      {isOpen && (
        <ul
          className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg
            max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="relative py-2 pl-10 pr-4 text-gray-900 cursor-default select-none
                hover:bg-indigo-100 hover:text-indigo-900"
              role="option"
              aria-selected={value === option.value}
            >
              <span className={`block truncate ${
                  value === option.value ? "font-medium" : "font-normal"
                }`}
              >
                {option.label}
              </span>
              {value === option.value && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                  <CheckIcon />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};