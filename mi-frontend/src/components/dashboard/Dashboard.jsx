import useFetch from '../../hooks/useFetch';
import { useApp } from '../../context/AppContext';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  // Libros, préstamos y usuarios desde la API
  const { data: books } = useFetch(`${import.meta.env.VITE_API_URL}/api/libros`);
  const { data: loans } = useFetch(`${import.meta.env.VITE_API_URL}/api/prestamos`);
  const { data: users } = useFetch(`${import.meta.env.VITE_API_URL}/api/users`);

  // Calcular libros agregados en el mes más reciente
  let librosMes = 0;
  if (Array.isArray(books) && books.length > 0) {
    const meses = books
      .map(b => b.createdAt ? new Date(b.createdAt) : null)
      .filter(Boolean)
      .map(d => `${d.getFullYear()}-${d.getMonth()}`);
    const mesReciente = meses.sort().reverse()[0];
    librosMes = books.filter(b => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}` === mesReciente;
    }).length;
  }

  // Calcular préstamos creados en el mes más reciente
  let prestamosMes = 0;
  if (Array.isArray(loans) && loans.length > 0) {
    const meses = loans
      .map(l => l.createdAt ? new Date(l.createdAt) : null)
      .filter(Boolean)
      .map(d => `${d.getFullYear()}-${d.getMonth()}`);
    const mesReciente = meses.sort().reverse()[0];
    prestamosMes = loans.filter(l => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}` === mesReciente;
    }).length;
  }

  // Calcular usuarios registrados en el mes más reciente
  let usuariosMes = 0;
  if (Array.isArray(users) && users.length > 0) {
    const meses = users
      .map(u => u.createdAt ? new Date(u.createdAt) : null)
      .filter(Boolean)
      .map(d => `${d.getFullYear()}-${d.getMonth()}`);
    const mesReciente = meses.sort().reverse()[0];
    usuariosMes = users.filter(u => {
      if (!u.createdAt) return false;
      const d = new Date(u.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}` === mesReciente;
    }).length;
  }

  const stats = [
    {
      title: 'Total de Libros',
      value: Array.isArray(books) ? books.length : 0,
      change: `+${librosMes} este mes`,
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Préstamos Activos',
      value: Array.isArray(loans) ? loans.filter(loan => loan.status === 'activo').length : 0,
      change: `+${prestamosMes} este mes`,
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Usuarios Registrados',
      value: Array.isArray(users) ? users.length : 0,
      change: `+${usuariosMes} este mes`,
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    }
  ];

  const recentLoans = Array.isArray(loans) ? loans.slice(0, 5) : [];
  const randomBooks = Array.isArray(books) ? [...books].sort(() => 0.5 - Math.random()).slice(0, 4) : [];

  // Navegación rápida
  const goTo = (view) => dispatch({ type: 'SET_VIEW', payload: view });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Bienvenido al sistema de gestión bibliotecaria</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.positive ? 'text-green-600' : 'text-orange-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <div className="text-primary-600">
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Préstamos Recientes</h2>
            <button onClick={() => goTo('loans')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {recentLoans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{loan.libro || 'Libro'}</p>
                  <p className="text-sm text-slate-600">{loan.usuario || 'Usuario'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loan.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    loan.estado === 'vencido' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {loan.estado}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{loan.fDevoluciones ? new Date(loan.fDevoluciones).toLocaleDateString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Libros Aleatorios */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Libros Destacados</h2>
            <button onClick={() => goTo('books')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {randomBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{book.nombre}</p>
                  <p className="text-sm text-slate-600">{book.descripcion}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {book.estado}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Año: {book.annio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => goTo('books')} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-left">
            <div className="text-primary-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-900">Agregar Libro</h3>
            <p className="text-sm text-slate-600">Registrar nuevo libro</p>
          </button>
          
          <button onClick={() => goTo('users')} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-left">
            <div className="text-primary-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-900">Nuevo Usuario</h3>
            <p className="text-sm text-slate-600">Registrar usuario</p>
          </button>
          
          <button onClick={() => goTo('loans')} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-left">
            <div className="text-primary-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-900">Procesar Préstamo</h3>
            <p className="text-sm text-slate-600">Gestionar préstamo</p>
          </button>
          
          <button onClick={() => goTo('categories')} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-left">
            <div className="text-primary-600 mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-900">Ver Categorías</h3>
            <p className="text-sm text-slate-600">Listado de categorías</p>
          </button>
        </div>
      </div>
    </div>
  );
}