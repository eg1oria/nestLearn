'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, type LoginDto, type RegisterDto } from '@/api/autnApi';
import { useAuth } from '@/contexts/AuthContext';
import './Auth.scss';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>('login');

  const [loginForm, setLoginForm] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterDto>({
    name: '',
    email: '',
    phone: '+7',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      await login(loginForm);
      router.replace('/');
    } catch (e) {
      console.error(e);
      setError('Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      setLoading(true);

      await authApi.register(registerForm);

      setMode('login');
      setLoginForm((p) => ({ ...p, email: registerForm.email }));
    } catch (e) {
      console.error(e);
      setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="mode-toggle">
          <button
            type="button"
            onClick={() => setMode('login')}
            disabled={loading}
            className={mode === 'login' ? 'active' : ''}>
            Вход
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            disabled={loading}
            className={mode === 'register' ? 'active' : ''}>
            Регистрация
          </button>
        </div>

        {mode === 'login' ? (
          <div className="form-content">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Пароль"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="submit-button">
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        ) : (
          <div className="form-content">
            <div className="input-group">
              <input
                type="text"
                placeholder="Имя"
                value={registerForm.name}
                onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <input
                type="tel"
                placeholder="Phone"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Пароль"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="submit-button">
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
