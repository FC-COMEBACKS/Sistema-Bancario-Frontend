import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm, RegisterForm, ForgotPasswordForm } from '../../components';
import './authPage.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('login');
  React.useEffect(() => {
    if (location.pathname.includes('/register')) {
      setActiveForm('register');
    } else if (location.pathname.includes('/recuperar-password')) {
      setActiveForm('forgotPassword');
    } else {
      setActiveForm('login');
    }
  }, [location.pathname]);
  const switchForm = (form) => {
    setActiveForm(form);
    if (form === 'register') {
      navigate('/auth/register');
    } else if (form === 'forgotPassword') {
      navigate('/auth/recuperar-password');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-tabs mb-6">
          <button
            className={`auth-tab ${activeForm === 'login' ? 'active' : ''}`}
            onClick={() => switchForm('login')}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${activeForm === 'register' ? 'active' : ''}`}
            onClick={() => switchForm('register')}
          >
            Registrarse
          </button>
        </div>
        
        <div className="auth-form-wrapper">
          {activeForm === 'login' && <LoginForm />}
          {activeForm === 'register' && <RegisterForm />}
          {activeForm === 'forgotPassword' && <ForgotPasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
