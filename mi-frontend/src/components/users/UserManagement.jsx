import { useState } from 'react';
import useFetch from '../../hooks/useFetch';

export default function UserManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'usuario',
    status: 'activo'
  });
  const roles = ['admin', 'bibliotecario', 'usuario'];
  const statuses = ['activo', 'suspendido', 'inactivo'];

  // Hook para obtener usuarios
  const { data: users, loading, error, refetch } = useFetch(`${import.meta.env.VITE_API_URL}/api/users`);

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = {
      ...formData,
      joinDate: new Date().toISOString().split('T')[0]
    };

    if (editingUser) {
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: { ...userData, id: editingUser.id } 
      });
    } else {
      dispatch({ type: 'ADD_USER', payload: userData });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'usuario',
      status: 'activo'
    });
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      dispatch({ type: 'DELETE_USER', payload: userId });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'bibliotecario':
        return 'bg-blue-100 text-blue-800';
      case 'usuario':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'suspendido':
        return 'bg-red-100 text-red-800';
      case 'inactivo':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {loading && <div>Cargando usuarios...</div>}
      {error && <div className="text-red-500">Error al cargar usuarios</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-600">Administra los usuarios del sistema</p>
        </div>
        {/* Botón eliminado */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{users ? users.length : 0}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {users ? users.filter(user => user.status === 'activo').length : 0}
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
              <p className="text-sm font-medium text-slate-600">Bibliotecarios</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {users ? users.filter(user => user.role === 'bibliotecario').length : 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Suspendidos</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {users ? users.filter(user => user.status === 'suspendido').length : 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Buscar usuarios
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filtrar por rol
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Todos los roles</option>
              {roles.map(role => (
                <option key={role} value={role} className="capitalize">{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                </h2>
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
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {roles.map(role => (
                      <option key={role} value={role} className="capitalize">{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {statuses.map(status => (
                      <option key={status} value={status} className="capitalize">{status}</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingUser ? 'Actualizar' : 'Agregar'} Usuario
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Fecha Registro</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-medium text-slate-900">{user.nombre}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{user.joinDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
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