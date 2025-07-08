/**
 * Validador para nombres de usuario
 * @param {string} username - Nombre de usuario a validar
 * @returns {boolean|string} - Retorna true si es válido, o un mensaje de error
 */
export const validateUsername = (username) => {
  if (!username) return 'El nombre de usuario es requerido';
  
  if (username.length < 4) {
    return 'El nombre de usuario debe tener al menos 4 caracteres';
  }
  
  if (username.length > 20) {
    return 'El nombre de usuario no debe exceder los 20 caracteres';
  }
  
  // Solo permitir letras, números y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'El nombre de usuario solo puede contener letras, números y guiones bajos';
  }
  
  return true;
};
