'use strict'

const express = require('express');
const entryController = require('../controllers/entry');

const router = express.Router();

// Rutas de prueba
// router.post('/datos-curso', entryController.datosCurso);
// router.get('/test', entryController.test);

// Rutas
router.post('/save', entryController.save);
router.get('/entries/:page?', entryController.getEntries);
router.get('/entry/:id', entryController.getEntry);
router.put('/entry/:id', entryController.update);
router.delete('/entry/:id', entryController.delete);

module.exports = router;