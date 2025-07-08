/**
 * Validador para límites diarios de transacciones
 * @param {number|string} limit - Límite diario a validar
 * @param {number} minLimit - Límite mínimo permitido (opcional, por defecto 0)
 * @param {number} maxLimit - Límite máximo permitido (opcional, por defecto 1,000,000)
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateDailyLimit = (limit, minLimit = 0, maxLimit = 1000000) => {
  if (limit === undefined || limit === null || limit === '') {
    return 'El límite diario es requerido';
  }
  
  // Convertir a número si es string
  const numericLimit = typeof limit === 'string' ? parseFloat(limit) : limit;
  
  // Verificar que sea un número válido
  if (isNaN(numericLimit)) {
    return 'El límite diario debe ser un número válido';
  }
  
  // Verificar que sea mayor o igual al mínimo
  if (numericLimit < minLimit) {
    return `El límite diario debe ser mayor o igual a ${minLimit.toLocaleString()}`;
  }
  
  // Verificar que sea menor o igual al máximo
  if (numericLimit > maxLimit) {
    return `El límite diario no puede ser mayor a ${maxLimit.toLocaleString()}`;
  }
  
  return true;
};
