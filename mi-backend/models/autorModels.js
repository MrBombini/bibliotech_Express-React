const db = require('../config/db');

// Obtener todos los autores
exports.obtenerAutores = async () => {
  const [rows] = await db.query('SELECT * FROM autores');
  return rows;
};

// Crear un nuevo autor
exports.crearAutor = async (autor) => {
  const { nombre, nacionalidad } = autor;
  const [result] = await db.query(
    'INSERT INTO autores (nombre, nacionalidad) VALUES (?, ?)',
    [nombre, nacionalidad]
  );
  return { id: result.insertId, ...autor };
};
