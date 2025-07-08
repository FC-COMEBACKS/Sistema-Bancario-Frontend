/**
 * Validador para direcciones
 * @param {string} address - Dirección a validar
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateAddress = (address) => {
  if (!address) return 'La dirección es requerida';
  
  if (address.trim().length < 5) {
    return 'La dirección debe tener al menos 5 caracteres';
  }
  
  if (address.trim().length > 200) {
    return 'La dirección no debe exceder los 200 caracteres';
  }
  
  // Verificar que no contenga caracteres inválidos
  const invalidChars = /[^\w\s.,#\-()áéíóúÁÉÍÓÚñÑüÜ]/;
  if (invalidChars.test(address)) {
    return 'La dirección contiene caracteres no permitidos';
  }
  
  return true;
};
