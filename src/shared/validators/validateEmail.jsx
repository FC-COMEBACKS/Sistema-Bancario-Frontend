export const validateEmail = (email) => {
  if (!email) return 'El correo electrónico es requerido';
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return 'Por favor ingrese un correo electrónico válido';
  }
  
  return true;
};
