'use strict';

// Modulos para crear el servidor
const express = require('express');
const bodyParser = require('body-parser');

// Ejecucion express (http)
const app = express();

// Cargar ficheros rutas
const entryRoutes = require('./routes/entry');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS

// Prefijos a rutas / Cargar
app.use('/api', entryRoutes);

// Exportar modulo
module.exports = app;
