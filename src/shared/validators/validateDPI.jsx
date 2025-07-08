/**
 * Validador para DPI guatemalteco
 * @param {string} dpi - DPI a validar
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateDPI = (dpi) => {
  if (!dpi) return 'El DPI es requerido';
  
  // Eliminar espacios y guiones
  const cleanDPI = dpi.replace(/[-\s]/g, '');
  
  // El DPI debe tener 13 dígitos
  if (cleanDPI.length !== 13) {
    return 'El DPI debe tener 13 dígitos';
  }
  
  // Solo debe contener números
  if (!/^\d+$/.test(cleanDPI)) {
    return 'El DPI solo debe contener números';
  }
  
  // Aquí se podría implementar una validación más compleja del algoritmo de verificación del DPI
  // Por ahora solo validamos formato básico
  
  return true;
};
