const categoriaModel = require('../models/categoriesModel');

exports.getAll = async (req, res) => {
  try {
    const categorias = await categoriaModel.obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías.' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevaCategoria = req.body;
    const resultado = await categoriaModel.crearCategoria(nuevaCategoria);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría.' });
  }
};
