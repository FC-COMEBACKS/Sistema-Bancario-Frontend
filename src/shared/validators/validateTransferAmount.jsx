export const validateTransferAmount = (amount, balance, minTransfer = 1, dailyLimit = null) => {
  if (amount === undefined || amount === null || amount === '') {
    return 'El monto de transferencia es requerido';
  }
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return 'El monto debe ser un número válido';
  }

  if (numericAmount < minTransfer) {
    return `El monto mínimo de transferencia es ${minTransfer.toLocaleString()}`;
  }

  if (balance !== undefined && balance !== null && numericAmount > balance) {
    return `El monto excede tu saldo disponible de ${balance.toLocaleString()}`;
  }
  
  if (dailyLimit !== null && dailyLimit !== undefined && numericAmount > dailyLimit) {
    return `El monto excede tu límite diario de transferencia de ${dailyLimit.toLocaleString()}`;
  }
  
  return true;
};
