import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle';
}

const styles: Record<NonNullable<ActionButtonProps['variant']>, string> = {
  primary: 'rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700',
  secondary: 'rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
  subtle: 'rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200',
};

const ActionButton: React.FC<ActionButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  return <button {...props} className={`${styles[variant]} ${className}`} />;
};

export default ActionButton;