var express = require('express');
var app = express();

app.get('/todo/:busqueda', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

module.exports = app;