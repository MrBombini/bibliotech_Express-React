import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  currentView: 'login',
  sidebarOpen: true,
  books: [
    { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', isbn: '978-0307474728', category: 'Literatura', available: true, copies: 3, year: 1967 },
    { id: 2, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', isbn: '978-0142437230', category: 'Clásicos', available: true, copies: 2, year: 1605 },
    { id: 3, title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Ficción', available: false, copies: 1, year: 1949 },
    { id: 4, title: 'El Principito', author: 'Antoine de Saint-Exupéry', isbn: '978-0156012195', category: 'Infantil', available: true, copies: 5, year: 1943 },
    { id: 5, title: 'Crimen y Castigo', author: 'Fiódor Dostoyevski', isbn: '978-0486454115', category: 'Clásicos', available: true, copies: 2, year: 1866 }
  ],
  users: [
    { id: 1, name: 'Ana García', email: 'ana@email.com', role: 'usuario', status: 'activo', joinDate: '2024-01-15' },
    { id: 2, name: 'Carlos López', email: 'carlos@email.com', role: 'bibliotecario', status: 'activo', joinDate: '2023-08-20' },
    { id: 3, name: 'María Rodríguez', email: 'maria@email.com', role: 'usuario', status: 'suspendido', joinDate: '2024-03-10' },
    { id: 4, name: 'Admin Sistema', email: 'admin@biblioteca.com', role: 'admin', status: 'activo', joinDate: '2023-01-01' }
  ],
  loans: [
    { id: 1, bookId: 3, userId: 1, bookTitle: '1984', userName: 'Ana García', loanDate: '2024-12-01', dueDate: '2024-12-15', status: 'activo' },
    { id: 2, bookId: 2, userId: 3, bookTitle: 'Don Quijote de la Mancha', userName: 'María Rodríguez', loanDate: '2024-11-20', dueDate: '2024-12-04', status: 'vencido' }
  ],
  requests: [
    { id: 1, bookId: 1, userId: 1, bookTitle: 'Cien años de soledad', userName: 'Ana García', requestDate: '2024-12-10', status: 'pendiente' },
    { id: 2, bookId: 4, userId: 3, bookTitle: 'El Principito', userName: 'María Rodríguez', requestDate: '2024-12-09', status: 'aprobada' }
  ],
  notifications: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, currentView: 'dashboard' };
    case 'LOGOUT':
      return { ...state, user: null, currentView: 'login' };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        )
      };
    case 'DELETE_BOOK':
      return { ...state, books: state.books.filter(book => book.id !== action.payload) };
    case 'ADD_USER':
      return { ...state, users: [...state.users, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(user => user.id !== action.payload) };
    case 'ADD_LOAN':
      return { 
        ...state, 
        loans: [...state.loans, { ...action.payload, id: Date.now() }],
        books: state.books.map(book => 
          book.id === action.payload.bookId 
            ? { ...book, available: false, copies: book.copies - 1 }
            : book
        )
      };
    case 'RETURN_LOAN':
      const loan = state.loans.find(l => l.id === action.payload);
      return { 
        ...state, 
        loans: state.loans.map(l => 
          l.id === action.payload ? { ...l, status: 'devuelto' } : l
        ),
        books: state.books.map(book => 
          book.id === loan.bookId 
            ? { ...book, available: true, copies: book.copies + 1 }
            : book
        )
      };
    case 'ADD_REQUEST':
      return { ...state, requests: [...state.requests, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(request => 
          request.id === action.payload.id ? { ...request, ...action.payload } : request
        )
      };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, { ...action.payload, id: Date.now(), timestamp: new Date() }] 
      };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}