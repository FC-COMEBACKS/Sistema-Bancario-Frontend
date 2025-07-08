import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { useRegister } from '../../shared/hooks';
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateDPI,
  validatePhone,
  validateUsername,
  validateAddress,
  validateIncome
} from '../../shared/validators';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useRegister();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      dpi: '',
      celular: '',
      direccion: '',
      nombreTrabajo: '',
      ingresosMensuales: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    const { confirmPassword: _confirmPassword, ...userData } = data;
  
    if (userData.ingresosMensuales) {
      userData.ingresosMensuales = parseFloat(userData.ingresosMensuales);
    }
    
    console.log('Datos del formulario para registro:', userData);
    
    await registerUser(userData);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="register-form-container">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Registrarse</h2>
        <p className="text-gray-600">Crea una nueva cuenta en el sistema bancario</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de usuario"
            placeholder="usuario123"
            {...register('username', {
              required: 'El nombre de usuario es requerido',
              validate: value => validateUsername(value) === true || validateUsername(value)
            })}
            error={errors.username?.message}
          />
          
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            {...register('email', {
              required: 'El correo electrónico es requerido',
              validate: value => validateEmail(value) === true || validateEmail(value)
            })}
            error={errors.email?.message}
          />
          
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            {...register('nombre', {
              required: 'El nombre es requerido',
              validate: value => validateName(value) === true || validateName(value)
            })}
            error={errors.nombre?.message}
          />
          
          <Input
            label="Apellido"
            placeholder="Ingresa tu apellido"
            {...register('apellido', {
              required: 'El apellido es requerido',
              validate: value => validateName(value) === true || validateName(value)
            })}
            error={errors.apellido?.message}
          />
          
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              {...register('password', {
                required: 'La contraseña es requerida',
                validate: value => validatePassword(value) === true || validatePassword(value)
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              className="absolute right-2 top-10 text-gray-500 hover:text-gray-700"
              onClick={toggleShowPassword}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              La contraseña debe contener al menos 8 caracteres, 6 letras mayúsculas, 1 minúscula y 1 número.
            </p>
          </div>
          
          <Input
            label="Confirmar Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="Confirma tu contraseña"
            {...register('confirmPassword', {
              required: 'Debe confirmar la contraseña',
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
            error={errors.confirmPassword?.message}
          />
          
          <Input
            label="DPI"
            placeholder="Ingresa tu DPI"
            {...register('dpi', {
              required: 'El DPI es requerido',
              validate: value => validateDPI(value) === true || validateDPI(value)
            })}
            error={errors.dpi?.message}
          />
          
          <Input
            label="Celular"
            placeholder="Ingresa tu número de celular"
            {...register('celular', {
              required: 'El número de celular es requerido',
              validate: value => validatePhone(value) === true || validatePhone(value)
            })}
            error={errors.celular?.message}
          />

          <Input
            label="Dirección"
            placeholder="Ingresa tu dirección completa"
            {...register('direccion', {
              required: 'La dirección es requerida',
              validate: value => validateAddress(value) === true || validateAddress(value)
            })}
            error={errors.direccion?.message}
          />

          <Input
            label="Lugar de Trabajo"
            placeholder="Ingresa el nombre de tu trabajo"
            {...register('nombreTrabajo', {
              required: 'El lugar de trabajo es requerido',
              minLength: { value: 3, message: 'El nombre del trabajo debe tener al menos 3 caracteres' }
            })}
            error={errors.nombreTrabajo?.message}
          />

          <Input
            label="Ingresos Mensuales"
            placeholder="Ingresa tus ingresos mensuales"
            type="number"
            {...register('ingresosMensuales', {
              required: 'Los ingresos mensuales son requeridos',
              validate: value => validateIncome(value) === true || validateIncome(value)
            })}
            error={errors.ingresosMensuales?.message}
          />
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={!isValid || isLoading}
          className="login-button py-3 text-lg font-medium transition-transform duration-300 transform hover:scale-[1.02] active:scale-[0.98] mt-4"
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/auth" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
