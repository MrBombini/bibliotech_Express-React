const express = require('express');
const cors = require('cors'); // Importar el paquete cors
const app = express();
const PORT = 3000;

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const autorRoutes = require('./routes/autorRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const booksRoutes = require('./routes/booksRoutes');
const loansRoutes = require('./routes/loansRoutes');

// Configurar CORS
app.use(cors({ origin: 'https://bibliotech.proyectoinsti.site/' })); // Permitir solicitudes desde el frontend

// Middleware para analizar JSON
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/autor', autorRoutes);
app.use('/api/categorias', categoriesRoutes);
app.use('/api/libros', booksRoutes);
app.use('/api/prestamos', loansRoutes);

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
