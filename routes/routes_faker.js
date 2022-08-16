const express = require('express');
const { Router } = express;
const { mysql } = require('../db/db-config');
const FakerProducts = require('../classes/Faker')
const FakerP = new FakerProducts();

const router = new Router();

router.get('/',(req, res, next) =>{
    FakerP.FakerFunction().then((result) => {
		if (result !== undefined) {
            res.status(200).json({
                message: `Productos`,
                result: result
            });
        } else {
            res.status(404).json({
                error: `No existen productos`,
            });
        }
    });
    
});

router.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = router;
