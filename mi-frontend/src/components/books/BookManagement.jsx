import { useState } from 'react';
import useFetch from '../../hooks/useFetch';

export default function BookManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    id_autor: '',
    id_categoria: '',
    annio: '',
    descripcion: '',
    estado: 'disponible'
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Fetch libros, autores y categorias
  const { data: books, loading, error, refetch } = useFetch('http://127.0.0.1:3000/api/libros');
  const { data: autores } = useFetch('http://127.0.0.1:3000/api/autor');
  const { data: categorias } = useFetch('http://127.0.0.1:3000/api/categorias');
  // Hook para POST de libros
  const librosApi = useFetch('http://127.0.0.1:3000/api/libros', 'POST', null, false);

  const filteredBooks = (Array.isArray(books) ? books : []).filter(book => {
    const matchesSearch = book.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.descripcion && book.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === '' || book.id_categoria === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    const currentYear = new Date().getFullYear();
    if (parseInt(formData.annio) > currentYear) {
      setFormError(`El año no puede ser mayor a ${currentYear}`);
      setFormLoading(false);
      return;
    }
    try {
      const newBook = {
        nombre: formData.nombre,
        id_autor: parseInt(formData.id_autor),
        id_categoria: parseInt(formData.id_categoria),
        annio: parseInt(formData.annio),
        descripcion: formData.descripcion,
        estado: formData.estado
      };
      await librosApi.execute(newBook, 'POST');
      refetch();
      resetForm();
    } catch (err) {
      setFormError('Error al agregar libro');
      console.log((err && err.message) || 'Error desconocido al agregar libro');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      id_autor: '',
      id_categoria: '',
      annio: '',
      descripcion: '',
      estado: 'disponible'
    });
    setShowForm(false);
    setEditingBook(null);
    setFormError('');
  };

  const handleEdit = (book) => {
    setFormData({
      nombre: book.nombre,
      id_autor: book.id_autor,
      id_categoria: book.id_categoria,
      annio: book.annio,
      descripcion: book.descripcion,
      estado: book.estado
    });
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      // dispatch({ type: 'DELETE_BOOK', payload: bookId });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      {loading && <div>Cargando libros...</div>}
      {error && <div className="text-red-500">Error al cargar libros</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Libros</h1>
          <p className="text-slate-600">Administra el catálogo de la biblioteca</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Agregar Libro</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Buscar libros
            </label>
            <input
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filtrar por categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              <option value="">Todas las categorías</option>
              {Array.isArray(categorias) && categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingBook ? 'Editar Libro' : 'Agregar Nuevo Libro'}
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
                    Título
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Autor
                  </label>
                  <select
                    name="id_autor"
                    value={formData.id_autor}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Selecciona un autor</option>
                    {Array.isArray(autores) && autores.map(autor => (
                      <option key={autor.id} value={autor.id}>{autor.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="id_categoria"
                    value={formData.id_categoria}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {Array.isArray(categorias) && categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Año
                  </label>
                  <input
                    type="number"
                    name="annio"
                    value={formData.annio}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="disponible">Disponible</option>
                    <option value="prestado">Prestado</option>
                  </select>
                </div>
                {formError && <div className="text-red-600 text-sm mt-2">{formError}</div>}
                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1" disabled={formLoading}>
                    {formLoading ? 'Guardando...' : (editingBook ? 'Actualizar' : 'Agregar')} Libro
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

      {/* Books Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Título</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Autor</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Año</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="table-row">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{book.nombre}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {Array.isArray(autores) ? (autores.find(a => a.id === book.id_autor)?.nombre || book.id_autor) : book.id_autor}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {Array.isArray(categorias) ? (categorias.find(c => c.id === book.id_categoria)?.nombre || book.id_categoria) : book.id_categoria}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{book.annio}</td>
                  <td className="py-3 px-4 text-slate-600">{book.estado}</td>
                  <td className="py-3 px-4 text-slate-600">{book.descripcion}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-700"
                      >
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