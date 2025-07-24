import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../ui/Input.jsx';
import { validateEmail } from '../../shared/validators';

const ForgotPasswordForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Enviando solicitud para:', formData.email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Se ha enviado un correo con instrucciones para restablecer tu contraseña');
      setEmailSent(true);
    } catch (err) {
      console.error('Error en recuperación de contraseña:', err);
      toast.error('Error al enviar el correo. Intenta de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmailField = (value) => {
    const result = validateEmail(value);
    return result === true ? true : result;
  };

  if (emailSent) {
    return (
      <div className="forgot-password-form-container">
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">¡Correo enviado!</h2>
          <p className="mt-2 text-gray-600">
            Por favor, revisa tu correo electrónico para seguir las instrucciones y restablecer tu contraseña.
          </p>
          <button 
            className="submit-button mt-6"
            onClick={() => window.location.href = '/auth'}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-form-container">
      <div className="form-title">Recuperar Contraseña</div>
      <div className="form-subtitle">Ingresa tu correo electrónico para restablecer tu contraseña</div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="usuario@ejemplo.com"
            {...register('email', {
              required: 'El correo electrónico es requerido',
              validate: validateEmailField
            })}
            error={errors.email?.message}
          />
        </div>
        
        <div className="forgot-password-buttons">
          <Link to="/auth" className="cancel-link">
            Cancelar
          </Link>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Correo'}
          </button>
        </div>
      </form>

      <div className="login-redirect">
        <span>¿Ya tienes una cuenta? </span>
        <Link to="/auth" className="login-link">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
