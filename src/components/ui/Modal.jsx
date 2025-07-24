import React from 'react';
import PropTypes from 'prop-types';
import '../movimiento/MovimientoModals.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = '',
  ...props 
}) => {
  if (!isOpen) return null;

  const isConfirmationModal = className.includes('confirmation-modal');
  const overlayClass = isConfirmationModal ? 
    `modal-overlay confirmation-overlay ${className}` : 
    `modal-overlay ${className}`;

  return (
    <div className={overlayClass}>
      <div className="modal-container" {...props}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
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
