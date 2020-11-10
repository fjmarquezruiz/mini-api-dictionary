'use strict';

const validator = require('validator');
const fs = require('fs');
const path = require('path');
const entryModel = require('../models/entry');

const controller = {
	// Controladores

	// ----------------------------------------------------------------------------------------
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
		} catch (err) {
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
			entryItem.save((err, entryStored) => {
				if (err || !entryStored) {
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

	// ----------------------------------------------------------------------------------------
	// LISTAR TODAS LAS ENTRADAS DEL DICCIONARIO
	// SI SE LE PASA UN NUMERO ES UNA PAGINACIÓN
	getEntries: (req, res) => {
		// --------------------------
		// Parametros para la query de listar

		var pageNum = req.params.page;

		if (!validator.isNumeric(pageNum)) {
			pageNum = 0;
		}

		var resPerPage = 5;
		var skipEntries = 0;
		var limitEntries = 0;

		if (pageNum) {
			skipEntries = resPerPage * pageNum - resPerPage;
			limitEntries = resPerPage;
		}

		// Find
		entryModel
			.find({})
			.sort('-id')
			.skip(skipEntries)
			.limit(limitEntries)
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

	// ----------------------------------------------------------------------------------------
	// OBTENER UN SOLO ELEMENTO/ENTRADA
	getEntry: (req, res) => {
		// Obtener el id de la entrada de la url
		var entryId = req.params.id;

		// Comprobar que existe
		if (!entryId || entryId == null) {
			return res.status(404).send({
				status: 'error',
				message: 'No existe la entrada',
			});
		}

		// Buscar la entrada
		entryModel.findById(entryId, (err, entry) => {
			if (err || !entry) {
				return res.status(404).send({
					status: 'error',
					message: 'No existe la entrada',
				});
			}

			// Devolver la entrada en json
			return res.status(200).send({
				status: 'success',
				entry,
			});
		});
	},

	// ----------------------------------------------------------------------------------------
	// ACTUALIZAR UN ELEMENTO/ENTRADA
	update: (req, res) => {
		// Obtener el id de la entrada de la url
		var entryId = req.params.id;

		// Recoger los datos que llega por put
		var params = req.body;

		const pWord = params.eWord;
		const pDefinition = params.eDefinition;
		const pPronunciation = params.ePronunciation;
		const pType = params.eType;
		// eTags: [String],

		console.log(params);

		// Validar los datos
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
		} catch (err) {
			return res.status(200).send({
				status: 'error',
				message: 'Faltan datos por enviar',
			});
		}

		if (validatorEWord && validatorEDefinition) {
			// Actualizar la entrada (find and update)
			entryModel.findOneAndUpdate(
				{ _id: entryId },
				params,
				{ new: true },
				(err, entryUpdated) => {
					if (err) {
						return res.status(500).send({
							status: 'error',
							message: 'Error al actualizar',
						});
					}
					if (!entryUpdated) {
						return res.status(404).send({
							status: 'error',
							message:
								'La entrada no se actualizado, posiblemente no exista',
						});
					}

					// Devolver la entrada actualizada en json
					return res.status(200).send({
						status: 'success',
						entry: entryUpdated,
					});
				}
			);
		} else {
			return res.status(200).send({
				status: 'error',
				message: 'Los datos no son válidos',
			});
		}
	},

	// ----------------------------------------------------------------------------------------
	// BORRAR UN ELEMENTO/ENTRADA
	delete: (req, res) => {
		// Obtener el id de la entrada de la url
		var entryId = req.params.id;

		// Borrar la entrada (find and delete)
		entryModel.findOneAndDelete({ _id: entryId }, (err, entryDeleted) => {
			if (err) {
				return res.status(500).send({
					status: 'error',
					message: 'Error al borrar',
				});
			}

			if (!entryDeleted) {
				return res.status(404).send({
					status: 'error',
					message:
						'No se ha borrado la entrada, posiblemente no exista',
				});
			}

			// Devolver la entrada borrada en json
			return res.status(200).send({
				status: 'success',
				entry: entryDeleted,
			});
		});
	},

	// ----------------------------------------------------------------------------------------
	// BUSCAR UN ELEMENTO/ENTRADA
	search: (req, res) => {
		// Sacar el string a buscar
		var searchString = req.params.search;

		// Buscar la entrada (find or)
		entryModel
			.find({
				$or: [
					{ eWord: { $regex: searchString, $options: 'i' } },
					{ eDefinition: { $regex: searchString, $options: 'i' } },
				],
			})
			.sort([['date', 'descending']])
			.exec((err, entries) => {
				if (err) {
					return res.status(500).send({
						status: 'error',
						message: 'Error al buscar',
					});
				}

				if (!entries || entries.length <= 0) {
					return res.status(404).send({
						status: 'error',
						message:
							'No hay entradas que coincidan con la búsqueda',
					});
				}

				// Devolver las entradas buscadas en json
				return res.status(200).send({
					status: 'success',
					entry: entries,
				});
			});
	},
};

module.exports = controller;
