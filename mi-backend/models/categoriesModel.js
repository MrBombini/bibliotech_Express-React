const db = require('../config/db');

// Obtener todas las categorías
exports.obtenerCategorias = async () => {
  const [rows] = await db.query('SELECT * FROM categorias');
  return rows;
};

// Crear una nueva categoría
exports.crearCategoria = async (categoria) => {
  const { nombre, descripcion } = categoria;
  const [result] = await db.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion]
  );
  return { id: result.insertId, ...categoria };
};
