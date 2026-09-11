import React from 'react';
import { LabeledInput } from '@/components/common/FormField';

interface TagInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label = '태그 (쉼표로 구분)', value, onChange, placeholder }) => {
  const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
  return (
    <div>
      <LabeledInput
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="bundle-tags"
        placeholder={placeholder ?? '예: palace, seoul, historical-site'}
      />
      {!!tags.length && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;