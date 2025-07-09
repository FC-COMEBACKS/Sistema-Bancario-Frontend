import React from 'react';

const Loader = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    success: 'text-green-500',
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    white: 'text-white'
  };

  return (
    <div className={`flex justify-center items-center ${className}`} {...props}>
      <div className={`spinner-border animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`} role="status">
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
};

export default Loader;
