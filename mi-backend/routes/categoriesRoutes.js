const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
// Ruta para obtener todos los autores
router.get('/', categoriesController.getAll);

// Ruta para crear un nuevo autor
router.post('/', categoriesController.create);

module.exports = router;