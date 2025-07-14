import { useState } from 'react';
import useFetch from '../../hooks/useFetch';

export default function CategoryManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const { data: categorias, loading, error, refetch } = useFetch('http://127.0.0.1:3000/api/categorias');
  const categoriasApi = useFetch('http://127.0.0.1:3000/api/categorias', 'POST', null, false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const newCategory = { nombre: formData.nombre, descripcion: formData.descripcion };
      if (editingCategory) {
        await categoriasApi.execute(newCategory, 'PUT');
      } else {
        await categoriasApi.execute(newCategory, 'POST');
      }
      refetch();
      resetForm();
    } catch (err) {
      setFormError('Error al guardar categoría');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '' });
    setShowForm(false);
    setEditingCategory(null);
    setFormError('');
  };

  const handleEdit = (cat) => {
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion });
    setEditingCategory(cat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      try {
        await categoriasApi.execute(null, 'DELETE');
        refetch();
      } catch {
        setFormError('Error al eliminar categoría');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {loading && <div>Cargando categorías...</div>}
      {error && <div className="text-red-500">Error al cargar categorías</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Categorías</h1>
          <p className="text-slate-600">Administra las categorías de la biblioteca</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Agregar Categoría</span>
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">{editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}</h2>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                  <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} className="input-field" required />
                </div>
                {formError && <div className="text-red-600 text-sm mt-2">{formError}</div>}
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1" disabled={formLoading}>{formLoading ? 'Guardando...' : (editingCategory ? 'Actualizar' : 'Agregar')}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(categorias) && categorias.map((cat) => (
                <tr key={cat.id} className="table-row">
                  <td className="py-3 px-4">{cat.nombre}</td>
                  <td className="py-3 px-4">{cat.descripcion}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(cat)} className="text-primary-600 hover:text-primary-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
