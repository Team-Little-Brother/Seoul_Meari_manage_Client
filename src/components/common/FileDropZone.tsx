import React, { useState, useCallback, useRef } from 'react';
import { DummyUploadCloudIcon } from './Icon'; // 아이콘 컴포넌트는 그대로 사용

interface FileDropZoneProps {
  label: string;
  required?: boolean;
  inputId: string;
  accept?: string;
  isMultiple?: boolean;
  onChange: (files: File[]) => void;
  placeholder?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  label,
  required,
  inputId,
  accept,
  isMultiple = false,
  onChange,
  placeholder,
}) => {
  // 선택된 파일 목록을 직접 상태로 관리
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // 드래그 중인지 여부를 추적하는 상태
  const [isDragging, setIsDragging] = useState(false);
  // input DOM 요소에 직접 접근하기 위한 ref
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);
      onChange(filesArray);
    }
  }, [onChange]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // onDrop 이벤트를 발생시키기 위해 필수
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };
  
  // 파일 선택을 초기화하는 함수
  const resetFiles = () => {
    setSelectedFiles([]);
    onChange([]);
    // input의 값을 초기화하여 같은 파일을 다시 선택할 수 있도록 함
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // 선택된 파일들의 이름을 화면에 표시하기 위한 문자열
  const fileNames = selectedFiles.map(file => file.name).join(', ');

  return (
    <div>
      <div className="flex justify-between items-center">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {/* 파일이 선택되었을 때만 초기화 버튼 표시 */}
        {selectedFiles.length > 0 && (
          <button type="button" onClick={resetFiles} className="text-sm font-medium text-gray-500 hover:text-gray-700">
            초기화
          </button>
        )}
      </div>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pb-6 pt-5 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <div className="text-center">
          <DummyUploadCloudIcon className="mx-auto h-10 w-10 text-gray-400" />
          <div className="mx-auto text-sm text-gray-600">
            <label
              htmlFor={inputId}
              className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>파일 선택</span> 또는 드래그 앤 드롭
              <input
                ref={inputRef}
                id={inputId}
                name={inputId}
                type="file"
                multiple={isMultiple}
                className="sr-only"
                onChange={handleFileChange}
                accept={accept}
              />
            </label>
          </div>
          <p className="mt-1 h-[32px] text-xs text-gray-500 break-all">
            {fileNames || placeholder}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileDropZone;