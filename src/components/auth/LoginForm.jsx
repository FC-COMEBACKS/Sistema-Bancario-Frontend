import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from '../ui/Input.jsx';
import { useLogin } from '../../shared/hooks';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    await login(data.identifier, data.password);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const validateIdentifier = (value) => {
    if (!value) return 'Este campo es requerido';
    if (value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Ingresa un correo electrónico válido';
    }
    return true;
  };

  const validatePasswordField = (value) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return true;
  };

  return (
    <div className="login-form-container">
      <div className="form-title">Iniciar Sesión</div>
      <div className="form-subtitle">Ingresa a tu cuenta para acceder al sistema bancario</div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <Input
            label="Usuario o Correo Electrónico"
            type="text"
            placeholder=""
            {...register('identifier', {
              required: 'Este campo es requerido',
              validate: validateIdentifier
            })}
            error={errors.identifier?.message}
          />
        </div>
        
        <div className="form-group">
          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder=""
              {...register('password', {
                required: 'La contraseña es requerida',
                validate: validatePasswordField
              })}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleShowPassword}
            >
              Mostrar
            </button>
          </div>
          {errors.password && <div className="error-message">{errors.password.message}</div>}
          <div className="password-help">
            La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número
          </div>
        </div>
        
        <div className="forgot-password">
          <Link to="/auth/recuperar-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
