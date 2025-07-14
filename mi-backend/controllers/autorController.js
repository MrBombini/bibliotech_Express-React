const autorModel = require('../models/autorModels');

exports.getAll = async (req, res) => {
  try {
    const autores = await autorModel.obtenerAutores();
    res.json(autores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los autores.' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoAutor = req.body;
    const resultado = await autorModel.crearAutor(nuevoAutor);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el autor.' });
  }
};
