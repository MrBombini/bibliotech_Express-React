const libroModel = require('../models/booksModel');

exports.getAll = async (req, res) => {
  try {
    const libros = await libroModel.obtenerLibros();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros.' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoLibro = req.body;
    const resultado = await libroModel.crearLibro(nuevoLibro);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el libro.' });
  }
};
