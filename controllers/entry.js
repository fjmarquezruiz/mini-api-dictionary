'use strict';

const validator = require('validator');
const fs = require('fs');
const path = require('path');
const entryModel = require('../models/entry');

const controller = {
	// Controladores

	// SALVAR UNA ENTRADA DEL DICCIONARIO
	save: (req, res) => {
		// Recoger datos
		const params = req.body;

		const pWord = params.eWord;
		const pDefinition = params.eDefinition;
		const pPronunciation = params.ePronunciation;
		const pType = params.eType;
		// eTags: [String],

		console.log(params);

		// Validar datos
		try {
			// Quitar espacios temporalmente
			let tWord = pWord.replace(/\s+/g, '');
			let tDefinition = pDefinition.replace(/\s+/g, '');

			var validatorEWord =
				!validator.isEmpty(pWord) && validator.isAlpha(tWord);
			// var validatorEWord = !validator.isEmpty(pWord);
			var validatorEDefinition =
				!validator.isEmpty(pDefinition) &&
				validator.isAlpha(tDefinition);

			console.log(validatorEWord);
		} catch (error) {
			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar',
			});
		}

		if (validatorEWord && validatorEDefinition) {
			// Crear objeto a guardar
			const entryItem = new entryModel();

			// Asignar valores
			entryItem.eWord = pWord;
			entryItem.eDefinition = pDefinition;
			entryItem.ePronunciation = pPronunciation;
			entryItem.eType = pType;

			// Guardar
			entryItem.save((error, entryStored) => {
				if (error || !entryStored) {
					return res.status(404).send({
						status: 'error',
						message: 'Los datos no se han guardado',
					});
				}

				// Devolver una respuesta
				return res.status(200).send({
					status: 'success',
					entry: entryStored,
				});
			});
		} else {
			return res.status(200).send({
				status: 'error',
				message: 'Los datos no son válidos',
			});
		}
	},

	// LISTAR TODAS LAS ENTRADAS DEL DICCIONARIO
	// SI SE LE PASA UN NUMERO ES UNA PAGINACIÓN
	getEntries: (req, res) => {
		// --------------------------
		// Parametros para la query de listar

		var PAGE = req.params.page;

		if (!validator.isNumeric(PAGE)) {
			PAGE = 0;
		}

		var RES_PER_PAGE = 5;
		var SKIP = 0;
		var LIMIT = 0;

		if (PAGE) {
			SKIP = RES_PER_PAGE * PAGE - RES_PER_PAGE;
			LIMIT = RES_PER_PAGE;
		}

		// Find
		entryModel
			.find({})
			.sort('-id')
			.skip(SKIP)
			.limit(LIMIT)
			.exec((err, entries) => {
				if (err) {
					return res.status(500).send({
						status: 'error',
						message: 'Error al devolver las entradas',
					});
				}

				if (!entries || entries.length === 0) {
					return res.status(404).send({
						status: 'error',
						message: 'No hay entradas para mostrar',
					});
				}

				return res.status(200).send({
					status: 'success',
					entries,
				});
			});
	},

	// OBTENER UN SOLO ELEMENTO/ENTRADA

	getEntry: (req, res) => {
		return res.status(200).send({
			status: 'success',
			message: 'Un solo elemento',
		});
	},
};

module.exports = controller;
