/**
 * Validador para nombres y apellidos
 * @param {string} name - Nombre a validar
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateName = (name) => {
  if (!name) return 'El nombre es requerido';
  
  if (name.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  if (name.trim().length > 50) {
    return 'El nombre no debe exceder los 50 caracteres';
  }
  
  // Solo permitir letras, espacios y algunos caracteres especiales (para nombres compuestos)
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return 'El nombre solo puede contener letras, espacios y caracteres especiales como - o \'';
  }
  
  return true;
};
