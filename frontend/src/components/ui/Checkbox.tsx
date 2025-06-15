import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`flex items-center space-x-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`
          w-5 h-5 border-2 rounded transition-all duration-200
          ${checked 
            ? 'bg-blue-600 border-blue-600' 
            : 'bg-white border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}>
          {checked && (
            <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-gray-700 select-none">
        {label}
      </span>
    </label>
  );
};