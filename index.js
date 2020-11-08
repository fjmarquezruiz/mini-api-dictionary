'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3900;

const urlDB = 'mongodb://localhost:27017/api_rest_dictionary';
const optionsDB = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

// mongoose.connect(urlDB, optionsDB).then(()=>{
// 	console.log('La conexion se ha realizado');
// });


async function connectDB() {
	try {
		mongoose.set('useFindAndModify', false);
		mongoose.Promise = global.Promise;
		const connectionDB = await mongoose.connect(urlDB, optionsDB);

		console.log('La conexion se ha relizado!!!');

		// Servidor
		app.listen(port, () => {
			console.log(`Servidor corriendo en http://localhost:${port}`);
		});

	} catch (error) {
		console.log(error);
	}
	
}

connectDB();
