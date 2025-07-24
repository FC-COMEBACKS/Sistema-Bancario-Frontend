export const validatePhone = (phone) => {
  if (!phone) return 'El número de teléfono es requerido';
  
  const cleanPhone = phone.replace(/[-\s()]/g, '');
  
  if (!/^\d+$/.test(cleanPhone)) {
    return 'El número de teléfono solo debe contener dígitos';
  }

  if (cleanPhone.length !== 8) {
    return 'El número de teléfono debe tener 8 dígitos';
  }
  
  const validPrefix = /^[2-7]/;
  if (!validPrefix.test(cleanPhone)) {
    return 'El número de teléfono debe comenzar con un prefijo válido (2-7)';
  }
  
  return true;
};
