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
      <div className="form-title">Registrarse</div>
      <div className="form-subtitle">Crea una nueva cuenta en el sistema bancario</div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <Input
            label="Nombre de usuario"
            placeholder="usuario123"
            {...register('username', {
              required: 'El nombre de usuario es requerido',
              validate: value => validateUsername(value) === true || validateUsername(value)
            })}
            error={errors.username?.message}
          />
        </div>
        
        <div className="form-group">
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
        </div>
        
        <div className="form-group">
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            {...register('nombre', {
              required: 'El nombre es requerido',
              validate: value => validateName(value) === true || validateName(value)
            })}
            error={errors.nombre?.message}
          />
        </div>
        
        <div className="form-group">
          <Input
            label="Apellido"
            placeholder="Ingresa tu apellido"
            {...register('apellido', {
              required: 'El apellido es requerido',
              validate: value => validateName(value) === true || validateName(value)
            })}
            error={errors.apellido?.message}
          />
        </div>
        
        <div className="form-group">
          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              {...register('password', {
                required: 'La contraseña es requerida',
                validate: value => validatePassword(value) === true || validatePassword(value)
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
            La contraseña debe contener al menos 8 caracteres, 6 letras mayúsculas, 1 minúscula y 1 número.
          </div>
        </div>
        
        <div className="form-group">
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
        </div>
        
        <div className="form-group">
          <Input
            label="DPI"
            placeholder="Ingresa tu DPI"
            {...register('dpi', {
              required: 'El DPI es requerido',
              validate: value => validateDPI(value) === true || validateDPI(value)
            })}
            error={errors.dpi?.message}
          />
        </div>
        
        <div className="form-group">
          <Input
            label="Celular"
            placeholder="Ingresa tu número de celular"
            {...register('celular', {
              required: 'El número de celular es requerido',
              validate: value => validatePhone(value) === true || validatePhone(value)
            })}
            error={errors.celular?.message}
          />
        </div>

        <div className="form-group">
          <Input
            label="Dirección"
            placeholder="Ingresa tu dirección completa"
            {...register('direccion', {
              required: 'La dirección es requerida',
              validate: value => validateAddress(value) === true || validateAddress(value)
            })}
            error={errors.direccion?.message}
          />
        </div>

        <div className="form-group">
          <Input
            label="Lugar de Trabajo"
            placeholder="Ingresa el nombre de tu trabajo"
            {...register('nombreTrabajo', {
              required: 'El lugar de trabajo es requerido',
              minLength: { value: 3, message: 'El nombre del trabajo debe tener al menos 3 caracteres' }
            })}
            error={errors.nombreTrabajo?.message}
          />
        </div>

        <div className="form-group">
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
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
