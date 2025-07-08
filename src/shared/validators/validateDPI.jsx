export const validateDPI = (dpi) => {
  if (!dpi) return 'El DPI es requerido';
  
  const cleanDPI = dpi.replace(/[-\s]/g, '');
  
  if (cleanDPI.length !== 13) {
    return 'El DPI debe tener 13 dígitos';
  }
  
  if (!/^\d+$/.test(cleanDPI)) {
    return 'El DPI solo debe contener números';
  }
  
  return true;
};
