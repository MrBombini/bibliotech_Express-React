import { useApp } from '../../context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'books', label: 'Gestión de Libros', icon: 'books' },
  { id: 'loans', label: 'Préstamos', icon: 'loans' },
  { id: 'authors', label: 'Autores', icon: 'users' },
  { id: 'categories', label: 'Categorías', icon: 'books' },
  { id: 'users', label: 'Usuarios', icon: 'users' }
];

const icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
    </svg>
  ),
  books: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  loans: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  authors: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2m12 0l-4-4m0 0l-4 4m4-4V2" />
    </svg>
  ),
  categories: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 9 9-9" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )
};

export default function Sidebar() {
  const { state, dispatch } = useApp();

  const handleNavigation = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-slate-200 
      transform ${state.sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
    `}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">BiblioTech</h2>
              <p className="text-sm text-slate-500">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                transition-colors duration-200 group
                ${state.currentView === item.id 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <span className={`
                ${state.currentView === item.id ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}
              `}>
                {icons[item.icon]}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-1">Ayuda y Soporte</h3>
            <p className="text-xs text-slate-500 mb-3">¿Necesitas ayuda? Contáctanos</p>
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              Centro de Ayuda →
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {state.sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}
    </aside>
  );
}