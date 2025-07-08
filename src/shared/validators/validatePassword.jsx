export const validatePassword = (password) => {
  if (!password) return 'La contraseña es requerida';
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
  if (uppercaseCount < 6) {
    return `La contraseña debe contener al menos 6 letras mayúsculas (tiene ${uppercaseCount})`;
  }
  
  return true;
};
