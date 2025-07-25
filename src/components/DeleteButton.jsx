import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button.jsx';
import './movimiento/MovimientoModals.css';

const DeleteButton = ({
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`btn-delete ${className}`}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="ml-1">Eliminar</span>
    </Button>
  );
};

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default DeleteButton;
