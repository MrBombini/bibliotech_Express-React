const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
// Ruta para obtener todos los autores
router.get('/', booksController.getAll);

// Ruta para crear un nuevo autor
router.post('/', booksController.create);

module.exports = router;