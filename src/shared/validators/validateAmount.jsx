/**
 * Validador para montos monetarios
 * @param {number|string} amount - Monto a validar
 * @param {number} min - Monto mínimo permitido (opcional, por defecto 0)
 * @param {number} max - Monto máximo permitido (opcional, por defecto sin límite)
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (amount === undefined || amount === null || amount === '') {
    return 'El monto es requerido';
  }
  
  // Convertir a número si es string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Verificar que sea un número válido
  if (isNaN(numericAmount)) {
    return 'El monto debe ser un número válido';
  }
  
  // Verificar que sea mayor o igual al mínimo
  if (numericAmount < min) {
    return `El monto debe ser mayor o igual a ${min.toLocaleString()}`;
  }
  
  // Verificar que sea menor o igual al máximo
  if (numericAmount > max) {
    return `El monto no puede ser mayor a ${max.toLocaleString()}`;
  }
  
  return true;
};
