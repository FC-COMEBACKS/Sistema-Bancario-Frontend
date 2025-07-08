import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button.jsx';
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
      // Aquí iría la llamada a la API para solicitar el restablecimiento de contraseña
      // Por ahora, simularemos un éxito después de un tiempo
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
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">¡Correo enviado!</h2>
        <p className="mt-2 text-gray-600">
          Por favor, revisa tu correo electrónico para seguir las instrucciones y restablecer tu contraseña.
        </p>
        <Button 
          variant="outline"
          className="mt-6"
          onClick={() => window.location.href = '/auth'}
        >
          Volver al inicio de sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="forgot-password-form-container">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recuperar Contraseña</h2>
        <p className="text-gray-600">Ingresa tu correo electrónico para restablecer tu contraseña</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        
        <div className="flex space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.location.href = '/auth'}
            className="flex-1"
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Correo'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
