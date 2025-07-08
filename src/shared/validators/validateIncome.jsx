export const validateIncome = (income) => {
  if (income === undefined || income === null || income === '') {
    return 'El ingreso es requerido';
  }
  
  const numericIncome = typeof income === 'string' ? parseFloat(income) : income;
  
  if (isNaN(numericIncome)) {
    return 'El ingreso debe ser un número válido';
  }

  if (numericIncome < 0) {
    return 'El ingreso no puede ser negativo';
  }

  const upperLimit = 10000000;
  if (numericIncome > upperLimit) {
    return `El ingreso no puede ser mayor a ${upperLimit.toLocaleString()}`;
  }
  
  return true;
};
