import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Register from '../users/Register';
import { loginWithApi } from './loginApiHelper';

export default function Login() {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Usuarios de prueba
    const testUsers = {
      'admin@biblioteca.com': { name: 'Admin Sistema', role: 'admin', email: 'admin@biblioteca.com' },
      'bibliotecario@biblioteca.com': { name: 'Carlos López', role: 'bibliotecario', email: 'bibliotecario@biblioteca.com' },
      'usuario@biblioteca.com': { name: 'Ana García', role: 'usuario', email: 'usuario@biblioteca.com' }
    };
    const user = testUsers[formData.email];
    if (user && formData.password === '123456') {
      dispatch({ type: 'LOGIN', payload: user });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `Bienvenido ${user.name}!` 
        } 
      });
      setLoading(false);
      return;
    }

    // Si no es usuario de prueba, intenta con la API
    const apiUser = await loginWithApi(formData.email, formData.password);
    if (apiUser) {
      dispatch({ type: 'LOGIN', payload: apiUser });
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: { 
          type: 'success', 
          message: `Bienvenido ${apiUser.name}!` 
        } 
      });
    } else {
      setError('Credenciales incorrectas.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (showRegister) {
    return <Register goToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Bibliotecass</h2>
          <p className="text-slate-600">Sistema de Gestión Bibliotecaria</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-900 mb-2">Usuarios de prueba:</h3>
            <div className="space-y-1 text-xs text-slate-600">
              <p><strong>Admin:</strong> admin@biblioteca.com / 123456</p>
              <p><strong>Bibliotecario:</strong> bibliotecario@biblioteca.com / 123456</p>
              <p><strong>Usuario:</strong> usuario@biblioteca.com / 123456</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-sm text-slate-600">¿No tienes cuenta? </span>
            <button
              type="button"
              className="text-primary-600 font-medium hover:underline ml-1"
              onClick={() => setShowRegister(true)}
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}