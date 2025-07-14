const db = require('../config/db');

exports.obtenerUsuarios = async () => {
  const [rows] = await db.query('SELECT * FROM usuarios');
  return rows;
};

exports.crearUsuario = async (usuario) => {
  const { nombre, email, password } = usuario;
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, password]
  );
  return { id: result.insertId, ...usuario };
};
