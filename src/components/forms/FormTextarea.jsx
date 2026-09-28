import React from 'react';

export const FormTextarea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const textareaId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        {maxLength && (
          <span className="text-[11px] text-slate-400">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        className={`w-full text-sm bg-slate-50 border rounded-lg p-3 transition-all outline-none resize-none ${
          error
            ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
            : 'border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
        } ${disabled ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''}`}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormTextarea;
