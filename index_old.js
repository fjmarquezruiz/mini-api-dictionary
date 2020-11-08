const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let usuario = {
	nombre: '',
	apellido: '',
};

let respuesta = {
	error: false,
	codigo: 200,
	mensaje: '',
};

app.get('/', (req, res) => {
	respuesta.error = false;
	respuesta.codigo = 200;
	respuesta.mensaje = 'Punto de inicio';

	res.send(respuesta);
});

app.get('/json', (req, res) => {
	respuesta.error = false;
	respuesta.codigo = 200;
	respuesta.mensaje = 'Leer json';

	fs.readFile('./users.json', (err, data) => {
		if (err) throw err;
		let users = JSON.parse(data);
		console.log(users);
	});

	res.send(respuesta);
});

app.get('/usuario', function (req, res) {
	respuesta = {
		error: false,
		codigo: 200,
		mensaje: '',
	};
	if (usuario.nombre === '' || usuario.apellido === '') {
		respuesta = {
			error: true,
			codigo: 501,
			mensaje: 'El usuario no ha sido creado',
		};
	} else {
		respuesta = {
			error: false,
			codigo: 200,
			mensaje: 'respuesta del usuario',
			respuesta: usuario,
		};
	}
	res.send(respuesta);
});
app.post('/usuario', function (req, res) {
	if (!req.body.nombre || !req.body.apellido) {
		respuesta = {
			error: true,
			codigo: 502,
			mensaje: 'El campo nombre y apellido son requeridos',
		};
	} else {
		if (usuario.nombre !== '' || usuario.apellido !== '') {
			respuesta = {
				error: true,
				codigo: 503,
				mensaje: 'El usuario ya fue creado previamente',
			};
		} else {
			usuario = {
				nombre: req.body.nombre,
				apellido: req.body.apellido,
			};
			respuesta = {
				error: false,
				codigo: 200,
				mensaje: 'Usuario creado',
				respuesta: usuario,
			};
		}
	}

	res.send(respuesta);
});

app.get('/hola', function (req, res) {
	res.send('[GET] Saludos desde express.');
});

app.post('/hola', function (req, res) {
	res.send('[POST] Saludos desde express.');
});

app.listen(3000, () => {
	console.log('El servidor está inicializado en el puerto 3000.');
});
