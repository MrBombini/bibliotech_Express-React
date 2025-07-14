const db = require('../config/db');

// Obtener todos los préstamos
exports.obtenerPrestamos = async () => {
  const [rows] = await db.query(`
    SELECT p.id, p.fPrestamo, p.fDevoluciones, p.estado,
           l.nombre AS libro, u.nombre AS usuario
    FROM prestamos p
    JOIN libros l ON p.id_libro = l.id
    JOIN usuarios u ON p.id_usuario = u.id
  `);
  return rows;
};

// Crear un nuevo préstamo
exports.crearPrestamo = async (prestamo) => {
  const { id_usuario, id_libro, fPrestamo, fDevoluciones, estado } = prestamo;
  const [result] = await db.query(
    `INSERT INTO prestamos (id_usuario, id_libro, fPrestamo, fDevoluciones, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [id_usuario, id_libro, fPrestamo, fDevoluciones, estado]
  );
  return { id: result.insertId, ...prestamo };
};
