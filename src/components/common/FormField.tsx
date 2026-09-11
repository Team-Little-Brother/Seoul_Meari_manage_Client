import React from 'react';

interface BaseProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Field: React.FC<BaseProps> = ({ label, required, htmlFor, hint, className = '', children }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  containerClassName?: string;
  required?: boolean;
}
export const LabeledInput: React.FC<InputProps> = ({ label, hint, containerClassName, required, id, ...rest }) => (
  <Field label={label} required={required} htmlFor={id} hint={hint} className={containerClassName}>
    <input
      id={id}
      {...rest}
      className={`mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-gray-900 ${rest.className || ''}`}
    />
  </Field>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  containerClassName?: string;
  required?: boolean;
}
export const LabeledTextarea: React.FC<TextareaProps> = ({ label, hint, containerClassName, required, id, ...rest }) => (
  <Field label={label} required={required} htmlFor={id} hint={hint} className={containerClassName}>
    <textarea
      id={id}
      {...rest}
      className={`mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-gray-900 ${rest.className || ''}`}
    />
  </Field>
);

export const FormRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const count = React.Children.count(children);
  const smCols =
    count >= 3 ? 'sm:grid-cols-3' : count === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1';

  return (
    <div className={`grid grid-cols-1 gap-4 ${smCols} ${className}`}>
      {children}
    </div>
  );
};