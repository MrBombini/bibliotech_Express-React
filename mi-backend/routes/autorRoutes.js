const express = require('express');
const router = express.Router();
const autorController = require('../controllers/AutorController');
// Ruta para obtener todos los autores
router.get('/', autorController.getAll);

// Ruta para crear un nuevo autor
router.post('/', autorController.create);

module.exports = router;