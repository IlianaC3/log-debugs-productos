const express = require('express');
const app = express();
const { mysql } = require('../db/db-config');
const { publicAuthorization } = require('../functions/auth');
const Productos = require('../classes/Productos');
const FakerProducts = require('../classes/Faker')
// const Usuarios = require('../classes/Usuarios');
const Producto = new Productos(mysql);
const FakerP = new FakerProducts();
// const Usuario = new Usuarios();
app.set('view engine', 'ejs');
app.set('views', './public');

const logger = require('../logger')

app.get('/', publicAuthorization, (req, res) => {
	logger.info('Ingresa a ruta home')
	Producto.getAll().then((result) => {
		let info = {
			result: result,
			name: req.user
		}
		if (result !== undefined) {
			res.render('index', { data: info});
		} else {
			res.status(404).json({
				error: `No existen productos`
			});
		}
	});
});

app.get('/agregar', publicAuthorization, (req, res) => {
	logger.info('Ingresa a ruta agrear')
	res.render('agregar');
});

app.get('/editar/:id', publicAuthorization, (req, res) => {
	logger.info('Ingresa a ruta editar')
	Producto.getById(req.params.id).then((result) => {
		if (result !== undefined) {
			if (result === null) {
				res.status(404).json({
					error: `Producto no encontrado para el id ${id}`
				});
			} else {
				res.render('editar', { data: result });
			}
		} else {
			res.status(404).json({
				error: `El archivo no se puede leer`
			});
		}
	});
});

// FAKER //
app.get('/productos-test', publicAuthorization, (req, res) => {
	logger.info('Ingresa a ruta productos-test')
	FakerP.FakerFunction().then((result) => {
		if (result !== undefined) {
			res.render('productos-test', { data: result });
		} else {
			res.status(404).json({
				error: `No existen productos`
			});
		}
	});
	
});


// LOGIN //
app.get('/login', (req, res) => {
	logger.info('Ingresa a ruta login')
    const person = req.user;
    if (person) {
        res.redirect('/')
    } else {
        res.render('login');
    }
})

app.get('/logout', (req, res) => {
	logger.info('Ingresa a ruta logout')
	let nombre = req.user
	req.logout(function(err) {
		if (err) { return next(err); }
    	res.render('logout', { data: nombre } );
	});
})

//REGISTRO
app.get('/signup',  (req, res) => {
	logger.info('Ingresa a ruta signup')
    res.render('signup');
})

app.use((req, res, next) => {
	logger.warn('Ruta front no encontrada')
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;
