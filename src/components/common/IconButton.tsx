// src/components/ui/IconButton.tsx
import React from 'react';

export const IconButton: React.FC<
  React.PropsWithChildren<{
    title?: string;
    onClick?: () => void;
    danger?: boolean;
  }>
> = ({ children, title, onClick, danger }) => (
  <button
    title={title}
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 text-sm ${
      danger
        ? "border-red-200 text-red-600 hover:bg-red-50"
        : "border-gray-200 text-gray-700 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);