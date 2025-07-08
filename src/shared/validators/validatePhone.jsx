/**
 * Validador para números de teléfono en Guatemala
 * @param {string} phone - Teléfono a validar
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validatePhone = (phone) => {
  if (!phone) return 'El número de teléfono es requerido';
  
  // Eliminar espacios, guiones y paréntesis
  const cleanPhone = phone.replace(/[-\s()]/g, '');
  
  // Verificar que sea numérico
  if (!/^\d+$/.test(cleanPhone)) {
    return 'El número de teléfono solo debe contener dígitos';
  }
  
  // Para Guatemala, validamos 8 dígitos
  if (cleanPhone.length !== 8) {
    return 'El número de teléfono debe tener 8 dígitos';
  }
  
  // Verificar que comience con dígitos válidos para Guatemala (normalmente 3, 4, 5, 6, 7)
  const validPrefix = /^[2-7]/;
  if (!validPrefix.test(cleanPhone)) {
    return 'El número de teléfono debe comenzar con un prefijo válido (2-7)';
  }
  
  return true;
};
