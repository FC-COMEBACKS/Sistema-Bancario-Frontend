export const validateAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (amount === undefined || amount === null || amount === '') {
    return 'El monto es requerido';
  }
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return 'El monto debe ser un número válido';
  }

  if (numericAmount < min) {
    return `El monto debe ser mayor o igual a ${min.toLocaleString()}`;
  }

  if (numericAmount > max) {
    return `El monto no puede ser mayor a ${max.toLocaleString()}`;
  }
  
  return true;
};
