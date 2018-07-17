// Requires
var express = require('express');
// const { Pool, Client } = require('pg');
var pg = require('pg');

// Inicializar variables
var app = express();


// Conexión a la Base de Datos
const cs = 'postgresql://postgres:123@localhost:5434/centinela';
const cliente = new pg.Client(cs);
cliente.connect(() => {
    console.log('Base de Datos, puerto: 5434: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server, puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});