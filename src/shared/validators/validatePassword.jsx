/**
 * Validates password strength - Matches backend validation exactly
 * @param {string} password - Password to validate
 * @returns {boolean|string} - True if valid, error message if invalid
 */
export const validatePassword = (password) => {
  if (!password) return 'La contraseña es requerida';
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  // Check for at least 6 uppercase letters - Match backend regex: /^(?:.*[A-Z]){6,}$/
  const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
  if (uppercaseCount < 6) {
    return `La contraseña debe contener al menos 6 letras mayúsculas (tiene ${uppercaseCount})`;
  }
  
  return true;
};
