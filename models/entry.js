'use strict';

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const entrySchema = schema({
	eWord: String,
	eDefinition: String,
	ePronunciation: [String],
	eType: String,
	eTags: [String],
	date: {
		type: Date,
		default: Date.now,
    },
});

module.exports = mongoose.model('Entrada', entrySchema);