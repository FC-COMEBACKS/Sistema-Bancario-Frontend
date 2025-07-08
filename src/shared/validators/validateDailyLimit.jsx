export const validateDailyLimit = (limit, minLimit = 0, maxLimit = 1000000) => {
  if (limit === undefined || limit === null || limit === '') {
    return 'El límite diario es requerido';
  }
  
  const numericLimit = typeof limit === 'string' ? parseFloat(limit) : limit;
  
  if (isNaN(numericLimit)) {
    return 'El límite diario debe ser un número válido';
  }
  
  if (numericLimit < minLimit) {
    return `El límite diario debe ser mayor o igual a ${minLimit.toLocaleString()}`;
  }

  if (numericLimit > maxLimit) {
    return `El límite diario no puede ser mayor a ${maxLimit.toLocaleString()}`;
  }
  
  return true;
};
