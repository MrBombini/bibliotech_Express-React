import { useApp } from '../../context/AppContext';

export default function Header() {
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-slate-900">
            Sistema de Gestión Bibliotecaria
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-6 15v-6a3 3 0 00-3-3H6a3 3 0 00-3 3v6a3 3 0 003 3h5a3 3 0 003-3z" />
              </svg>
              {state.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.notifications.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">{state.user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{state.user?.role}</p>
            </div>
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {state.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 text-slate-600"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}