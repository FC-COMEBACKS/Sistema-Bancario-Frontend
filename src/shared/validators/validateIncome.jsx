/**
 * Validador para ingresos monetarios
 * @param {number|string} income - Ingreso a validar
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateIncome = (income) => {
  if (income === undefined || income === null || income === '') {
    return 'El ingreso es requerido';
  }
  
  // Convertir a número si es string
  const numericIncome = typeof income === 'string' ? parseFloat(income) : income;
  
  // Verificar que sea un número válido
  if (isNaN(numericIncome)) {
    return 'El ingreso debe ser un número válido';
  }
  
  // Verificar que sea positivo
  if (numericIncome < 0) {
    return 'El ingreso no puede ser negativo';
  }
  
  // Definir un límite superior razonable (por ejemplo, 10 millones)
  const upperLimit = 10000000;
  if (numericIncome > upperLimit) {
    return `El ingreso no puede ser mayor a ${upperLimit.toLocaleString()}`;
  }
  
  return true;
};
