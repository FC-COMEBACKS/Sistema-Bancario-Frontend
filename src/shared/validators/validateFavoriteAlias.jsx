export const validateFavoriteAlias = (alias) => {
  if (!alias) return 'El alias es requerido';
  
  if (alias.trim().length < 2) {
    return 'El alias debe tener al menos 2 caracteres';
  }
  
  if (alias.trim().length > 30) {
    return 'El alias no debe exceder los 30 caracteres';
  }
  
  const aliasRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s_-]+$/;
  if (!aliasRegex.test(alias)) {
    return 'El alias solo puede contener letras, números, espacios, guiones y guiones bajos';
  }
  
  return true;
};
