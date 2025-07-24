import React from 'react';
import PropTypes from 'prop-types';
import '../movimiento/MovimientoModals.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  loading = false,
  ...props
}) => {
  const hasSpecificClass = className && (
    className.includes('btn-view') || 
    className.includes('btn-edit') || 
    className.includes('btn-delete') ||
    className.includes('btn-primary') ||
    className.includes('btn-secondary') ||
    className.includes('btn-success') ||
    className.includes('btn-warning') ||
    className.includes('btn-danger') ||
    className.includes('form-button')
  );
  
  let buttonClasses;
  
  if (hasSpecificClass) {
    buttonClasses = `
      ${className}
      ${fullWidth ? 'w-full' : ''}
    `.trim().replace(/\s+/g, ' ');
  } else {
    const baseClasses = 'form-button';
    
    const variantClasses = {
      primary: 'primary',
      secondary: 'secondary',
      success: 'primary',
      danger: 'btn-danger',
      outline: 'btn-secondary'
    };
    
    buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant] || variantClasses.primary}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }

  const { loading: _loading, ...restProps } = props;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...restProps}
    >
      {loading ? (
        <span className="loader mr-2" style={{ width: 16, height: 16, border: '2px solid #fff', borderTop: '2px solid #3498db', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
      ) : null}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default Button;
