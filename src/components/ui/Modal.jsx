import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  className = '',
  ...props 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    'full': 'max-w-full'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full m-4 ${className}`}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: size === 'lg' ? '32rem' : '28rem',
          width: '100%',
          margin: '1rem'
        }}
        {...props}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']),
  className: PropTypes.string
};

export default Modal;
