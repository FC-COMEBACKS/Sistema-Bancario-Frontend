import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputId = id || name;
  const baseClasses = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';
  
  const errorClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : '';
  
  const inputClasses = `
    ${baseClasses} 
    ${errorClass}
    ${disabledClass}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block mb-1 font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'date', 'time', 'datetime-local']),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string
};

export default Input;
