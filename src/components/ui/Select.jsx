import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Select para seleccionar opciones
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - ID del select
 * @param {string} props.name - Nombre del select
 * @param {string} props.label - Etiqueta del select
 * @param {Array} props.options - Opciones del select
 * @param {string} props.error - Mensaje de error
 * @param {boolean} props.disabled - Si el select está deshabilitado
 * @param {boolean} props.required - Si el select es requerido
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element} Componente Select
 */
const Select = forwardRef(({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  placeholder = 'Seleccione una opción',
  className = '',
  ...props
}, ref) => {
  const selectId = id || name;
  const baseClasses = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';
  
  const errorClass = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200';
  
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : '';
  
  const selectClasses = `
    ${baseClasses} 
    ${errorClass}
    ${disabledClass}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block mb-1 font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default Select;
