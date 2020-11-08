'use strict';

const validator = require('validator');
const fs = require('fs');
const path = require('path');
const entryModel = require('../models/entry');

console.log(entryModel);

const controller = {
	// Controladores
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

			var validatorEWord = !validator.isEmpty(pWord) && validator.isAlpha(tWord);
			// var validatorEWord = !validator.isEmpty(pWord);
			var validatorEDefinition = !validator.isEmpty(pDefinition) && validator.isAlpha(tDefinition);

			console.log(validatorEWord);

		} catch (error) {
			res.status(200).send({
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
					res.status(404).send({
						status: 'error',
						message: 'Los datos no se han guardado',
					});
				}

				// Devolver una respuesta
				res.status(200).send({
					status: 'success',
					entry: entryStored,
				});
			});
		} else {
			res.status(200).send({
				status: 'error',
				message: 'Los datos no son válidos',
			});
		}
	},

	save3: (req, res) => {
		// Recoger los parametros por post
		var params = req.body;
		console.log(params);

		// Validar datos con la libreria validator
		try {
			var validateTitle = !validator.isEmpty(params.eWord);
			var validateContent = !validator.isEmpty(params.eDefinition);
		} catch (err) {
			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar !!!',
			});
		}

		if (validateTitle && validateContent) {
			// return res.status(200).send({
			//     message: 'Validacion correcta'
			// });
			// Crear el objeto a guardar
			var articleItem = new entradaModel();

			// Asignar valores
			articleItem.title = params.title;
			articleItem.content = params.content;

			if (params.image) {
				articleItem.image = params.image;
			} else {
				articleItem.image = null;
			}

			// Guardar el articulo
			articleItem.save((err, articleStored) => {
				if (err || !articleStored) {
					return res.status(404).send({
						status: 'error',
						message: 'El artículo no se ha guardado !!!',
					});
				}

				// Devolver una respuesta
				return res.status(200).send({
					status: 'success',
					articleItem: articleStored,
				});
			});
		} else {
			return res.status(200).send({
				status: 'error',
				message: 'Los datos no son validos !!!',
			});
		}
	},
};

module.exports = controller;
