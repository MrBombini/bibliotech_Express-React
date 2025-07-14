const db = require('../config/db');

// Obtener todos los libros
exports.obtenerLibros = async () => {
  const [rows] = await db.query('SELECT * FROM libros');
  return rows;
};

// Crear un nuevo libro
exports.crearLibro = async (libro) => {
  const { nombre, id_autor, id_categoria, annio, descripcion, estado } = libro;

  const [result] = await db.query(
    'INSERT INTO libros (nombre, id_autor, id_categoria, annio, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, id_autor, id_categoria, annio, descripcion, estado]
  );

  return { id: result.insertId, ...libro };
};
