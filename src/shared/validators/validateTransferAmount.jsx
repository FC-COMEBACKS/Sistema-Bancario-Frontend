/**
 * Validador para montos de transferencias
 * @param {number|string} amount - Monto a validar
 * @param {number} balance - Saldo disponible
 * @param {number} minTransfer - Monto mínimo permitido (opcional, por defecto 1)
 * @param {number} dailyLimit - Límite diario (opcional)
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateTransferAmount = (amount, balance, minTransfer = 1, dailyLimit = null) => {
  if (amount === undefined || amount === null || amount === '') {
    return 'El monto de transferencia es requerido';
  }
  
  // Convertir a número si es string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Verificar que sea un número válido
  if (isNaN(numericAmount)) {
    return 'El monto debe ser un número válido';
  }
  
  // Verificar que sea mayor o igual al mínimo de transferencia
  if (numericAmount < minTransfer) {
    return `El monto mínimo de transferencia es ${minTransfer.toLocaleString()}`;
  }
  
  // Verificar que no exceda el saldo disponible
  if (balance !== undefined && balance !== null && numericAmount > balance) {
    return `El monto excede tu saldo disponible de ${balance.toLocaleString()}`;
  }
  
  // Verificar límite diario si está definido
  if (dailyLimit !== null && dailyLimit !== undefined && numericAmount > dailyLimit) {
    return `El monto excede tu límite diario de transferencia de ${dailyLimit.toLocaleString()}`;
  }
  
  return true;
};
