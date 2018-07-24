var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middleware/autenticacion');

var pg = require('pg');
var bdConf = require('../centinela/bd');

const pool = new pg.Pool(bdConf);

// =====================================================
// Listar todos los usuarios
// =====================================================
app.get('/', (req, res, next) => {
    pool.connect(function(err, client, done) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query('select * from seguridad.sp_sel_usuarios(0);', function(err, result) {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pueden cargar Usuarios',
                    errores: err + ' - ' + consulta
                })
            }
            res.status(200).send(result.rows);
        })
    });
});

// =====================================================
// Actualizar Usuario
// =====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    var body = req.body;
    var password = bcrypt.hashSync(body.password, 10);
    var consulta = 'SELECT * FROM seguridad.sp_usuarios(' + id + ',' + body.nombre + ',' + body.email + ',' + "'" + password + "'" + ',' + body.imagen + ',' + body.id_rol + ',' + body.google + ',' + body.uc + ',' + body.um + ');'
    console.log(consulta);

    pool.connect(function(err, client, done) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query(consulta, function(err, result) {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede actualizar la información del Usuario',
                    errores: err
                })
            }
            res.status(201).send(result.rows[0]);
        })
    });

    /* res.status(200).json({
        ok: true,
        id: id
    }); */
});


// =====================================================
// Crear un Usuario
// =====================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var password = bcrypt.hashSync(body.password, 10);
    var consulta = 'SELECT * FROM seguridad.sp_usuarios(' + body.id_usuario + ',' + body.nombre + ',' + body.email + ',' + "'" + password + "'" + ',' + body.imagen + ',' + body.id_rol + ',' + body.google + ',' + body.uc + ',' + body.um + ');'
        /* console.log(consulta); */

    pool.connect(function(err, client, done) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query(consulta, function(err, result) {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede crear el Usuario',
                    errores: err
                })
            }

            res.status(201).json({
                result: result.rows[0],
                usuariotoken: req.usuario
            });
        })
    });
    /* res.status(200).json({
        ok: true,
        body: body
    }) */
});

/* pool.end(); */


// =====================================================
// Desactivar un Usuario
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    var consulta = 'SELECT * FROM seguridad.sp_del_usuarios(' + id + ',' + body.ui + ');'
    console.log(consulta);

    pool.connect(function(err, client, done) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query(consulta, function(err, result) {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede desactivar el Usuario',
                    errores: err
                })
            }
            res.status(200).send(result.rows[0]);
        })
    });



});

module.exports = app;