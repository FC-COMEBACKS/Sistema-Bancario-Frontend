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
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Iniciar Sesión</h2>
        <p className="text-gray-600">Ingresa a tu cuenta para acceder al sistema bancario</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-group">
          <Input
            label="Usuario o Correo Electrónico"
            type="text"
            placeholder="Ingresa tu usuario o correo"
            {...register('identifier', {
              required: 'Este campo es requerido',
              validate: validateIdentifier
            })}
            className="login-input"
            error={errors.identifier?.message}
          />
        </div>
        
        <div className="form-group">
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              {...register('password', {
                required: 'La contraseña es requerida',
                validate: validatePasswordField
              })}
              className="login-input"
              error={errors.password?.message}
            />
            <button
              type="button"
              className="absolute right-2 top-10 text-gray-500 hover:text-gray-700"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número</div>
        </div>
        
        <div className="text-right">
          <Link to="/auth/recuperar-password" className="text-sm text-blue-600 hover:underline transition-colors duration-300">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-transform duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-300">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
