'use strict'

const express = require('express');
const entryController = require('../controllers/entry');

const router = express.Router();

// Rutas de prueba
// router.post('/datos-curso', entryController.datosCurso);
// router.get('/test', entryController.test);

// Rutas
router.post('/save', entryController.save);

module.exports = router;