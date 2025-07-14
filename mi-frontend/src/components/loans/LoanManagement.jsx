import { useState } from 'react';
import useFetch from '../../hooks/useFetch';

export default function LoanManagement() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    dueDate: '',
  });
  // Obtener préstamos, libros y usuarios desde la API
  const { data: loans, loading: loadingLoans, error: errorLoans, refetch: refetchLoans, execute: executeLoan } = useFetch('http://127.0.0.1:3000/api/prestamos');
  const { data: books, loading: loadingBooks, error: errorBooks } = useFetch('http://127.0.0.1:3000/api/libros');
  const { data: users, loading: loadingUsers, error: errorUsers } = useFetch('http://127.0.0.1:3000/api/users');
  const [userError, setUserError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Normalizar respuesta de la API a array
  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (!data) return [];
    return [data];
  };

  const loansArr = normalizeArray(loans);
  const booksArr = normalizeArray(books);
  const usersArr = normalizeArray(users);

  const activeLoans = loansArr.filter(loan => loan.estado === 'activo' || loan.estado === 'vencido');
  const availableBooks = booksArr.filter(book => book.estado === 'disponible');
  // Eliminar búsqueda, solo mostrar todos los usuarios activos o sin status
  const filteredUsers = usersArr.filter(user =>
    user.status === undefined || user.status === 'activo'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserError('');
    setSubmitError('');
    // Validar que el usuario existe
    const userExists = usersArr.some(
      user => user.id === parseInt(formData.userId) && (user.status === undefined || user.status === 'activo')
    );
    if (!userExists) {
      setUserError('El usuario seleccionado no existe o no está activo.');
      return;
    }
    // Validar que el libro existe
    const bookExists = booksArr.some(book => book.id === parseInt(formData.bookId) && book.estado === 'disponible');
    if (!bookExists) {
      setSubmitError('El libro seleccionado no está disponible.');
      return;
    }
    setSubmitting(true);
    try {
      // Construir el objeto para la API
      const newLoan = {
        id_usuario: parseInt(formData.userId),
        id_libro: parseInt(formData.bookId),
        fPrestamo: new Date().toISOString().split('T')[0],
        fDevoluciones: formData.dueDate,
        estado: 'activo'
      };
      await executeLoan(newLoan, 'POST');
      refetchLoans();
      resetForm();
    } catch (err) {
      setSubmitError('Error al registrar el préstamo.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: '',
      userId: '',
      dueDate: '',
    });
    setShowForm(false);
    setUserError('');
  };

  const handleReturn = (loanId) => {
    if (window.confirm('¿Confirmar devolución del libro?')) {
      // Aquí deberías usar el método execute de useFetch para hacer PUT/PATCH/DELETE a la API de préstamos
      // Si implementas el cambio, llama refetchLoans() después
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'userId') {
      setFormData({ ...formData, userId: e.target.value });
    } else if (e.target.name === 'bookId' || e.target.name === 'dueDate') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {(loadingLoans || loadingBooks || loadingUsers) && <div>Cargando datos...</div>}
      {(errorLoans || errorBooks || errorUsers) && <div className="text-red-500">Error al cargar datos</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Préstamos</h1>
          <p className="text-slate-600">Administra los préstamos de libros</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nuevo Préstamo</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Préstamos Activos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {activeLoans.filter(loan => loan.estado === 'activo').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Préstamos Vencidos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {activeLoans.filter(loan => loan.estado === 'vencido').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Devueltos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {loansArr.filter(loan => loan.estado === 'devuelto').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Nuevo Préstamo</h2>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Libro
                  </label>
                  <select
                    name="bookId"
                    value={formData.bookId}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccionar libro</option>
                    {availableBooks.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Usuario
                  </label>
                  <select
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="input-field"
                    required
                    disabled={submitting}
                  >
                    <option value="">Seleccionar usuario</option>
                    {filteredUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.nombre} - {user.email}
                      </option>
                    ))}
                  </select>
                  {userError && <div className="text-red-500 text-sm mt-1">{userError}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                {submitError && <div className="text-red-500 text-sm mt-2">{submitError}</div>}
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                    {submitting ? 'Registrando...' : 'Crear Préstamo'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loans Table */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Préstamos Activos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Libro</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Fecha Préstamo</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Fecha Vencimiento</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {activeLoans.map((loan) => (
                <tr key={loan.id} className="table-row">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{loan.libro || loan.id_libro}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{loan.usuario || loan.id_usuario}</td>
                  <td className="py-3 px-4 text-slate-600">{loan.fPrestamo ? loan.fPrestamo.substring(0, 10) : ''}</td>
                  <td className="py-3 px-4 text-slate-600">{loan.fDevoluciones ? loan.fDevoluciones.substring(0, 10) : ''}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{loan.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}