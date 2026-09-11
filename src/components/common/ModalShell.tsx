import React from 'react';
import { CloseIcon } from '@/components/common/Icon';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  maxWidthClassName?: string; // 예: "max-w-2xl"
}

const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = '',
  maxWidthClassName = 'max-w-2xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50" aria-modal="true" role="dialog">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${maxWidthClassName} rounded-2xl bg-white shadow-xl ${className}`}>
          {/* sticky header */}
          <div className="sticky top-0 z-10 border-b bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="닫기">
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* scrollable body */}
          <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalShell;