const userModel = require('../models/userModel');

exports.getAll = async (req, res) => {
  const usuarios = await userModel.obtenerUsuarios();
  res.json(usuarios);
};

exports.create = async (req, res) => {
  const nuevo = req.body;
  const resultado = await userModel.crearUsuario(nuevo);
  res.json(resultado);
};
