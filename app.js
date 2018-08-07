// Requires
var express = require('express');
var pg = require('pg');
var bdConf = require('./centinela/bd');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Configuración body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var rolesRoutes = require('./routes/roles');
var busquedaRoutes = require('./routes/busqueda');
var menuopcRoutes = require('./routes/menu_opciones');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/roles', rolesRoutes);
app.use('/menu_opciones', menuopcRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagenes', imagenesRoutes);

app.use('/', appRoutes);

// Escuchar Base de Datos
var pool = new pg.Pool(bdConf);

pool.connect(function(err, client, done) {
    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No es posible conectarse a la base de datos',
            errores: err
        })
    }
    console.log('Base de Datos, puerto: 5434: \x1b[32m%s\x1b[0m', 'online');
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server, puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});