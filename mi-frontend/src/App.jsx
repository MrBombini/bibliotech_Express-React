import { useState } from 'react';
import { useApp } from './context/AppContext';
import Login from './components/auth/Login';
import Register from './components/users/Register';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import BookManagement from './components/books/BookManagement';
import LoanManagement from './components/loans/LoanManagement';
import AuthorManagement from './components/authors/AuthorManagement';
import CategoryManagement from './components/categories/CategoryManagement';
import UserManagement from './components/users/UserManagement';

function App() {
  const { state } = useApp();
  const [showRegister, setShowRegister] = useState(false);

  if (!state.user) {
    if (showRegister) {
      return <Register goToLogin={() => setShowRegister(false)} />;
    }
    return <Login goToRegister={() => setShowRegister(true)} />;
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BookManagement />;
      case 'loans':
        return <LoanManagement />;
      case 'authors':
        return <AuthorManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <main className="p-6">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;