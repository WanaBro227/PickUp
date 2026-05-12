import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1c74e9] transition-all ${
        error 
          ? 'border-red-300 bg-red-50 focus:ring-red-500' 
          : 'border-slate-200 focus:ring-offset-1 hover:border-slate-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

Input.TextArea = ({ label, placeholder, value, onChange, error, className = '', rows = 4, ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
    )}
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1c74e9] transition-all resize-none ${
        error
          ? 'border-red-300 bg-red-50 focus:ring-red-500'
          : 'border-slate-200 focus:ring-offset-1 hover:border-slate-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default Input;
