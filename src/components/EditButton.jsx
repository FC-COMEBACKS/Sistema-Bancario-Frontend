import React from 'react';
import PropTypes from 'prop-types';
import Button from './ui/Button.jsx';

/**
 * Botón para editar registros
 * @param {Object} props - Propiedades del componente
 * @param {function} props.onClick - Función para manejar el clic
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.className - Clases adicionales
 * @returns {JSX.Element} Componente EditButton
 */
const EditButton = ({
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`text-blue-600 hover:bg-blue-50 ${className}`}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
        />
      </svg>
      <span className="ml-1">Editar</span>
    </Button>
  );
};

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default EditButton;
