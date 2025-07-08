export const validateName = (name) => {
  if (!name) return 'El nombre es requerido';
  
  if (name.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres';
  }
  
  if (name.trim().length > 50) {
    return 'El nombre no debe exceder los 50 caracteres';
  }
  
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return 'El nombre solo puede contener letras, espacios y caracteres especiales como - o \'';
  }
  
  return true;
};
