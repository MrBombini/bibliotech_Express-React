const prestamoModel = require('../models/loansModel');

// Obtener todos los préstamos
exports.getAll = async (req, res) => {
  try {
    const prestamos = await prestamoModel.obtenerPrestamos();
    res.json(prestamos);
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    // res.status(500).json({ error: 'Error al obtener los préstamos.' });
  }
};

// Crear un nuevo préstamo
exports.create = async (req, res) => {
  try {
    const nuevoPrestamo = req.body;
    const resultado = await prestamoModel.crearPrestamo(nuevoPrestamo);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al registrar préstamo:', error);
    res.status(500).json({ error: 'Error al registrar el préstamo.' });
  }
};