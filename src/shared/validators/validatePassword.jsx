export const validatePassword = (password) => {
  if (!password) return 'La nueva contraseña es obligatoria';
  return true;
};
