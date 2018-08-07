var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middleware/autenticacion');

var pg = require('pg');
var bdConf = require('../centinela/bd');

const pool = new pg.Pool(bdConf);

// =====================================================
// Listar todos los roles
// =====================================================
app.get('/', (req, res, next) => {
    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la Base de Datos',
                errores: err
            })
        }
        client.query('select * from seguridad.sp_sel_roles(0);', (err, result) => {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pueden cargar los Roles',
                    errores: err
                })
            }
            res.status(200).json({
                result: result.rows
            });
        })
    });
});

// =====================================================
// Actualizar Rol
// =====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    var body = req.body;
    // var password = bcrypt.hashSync(body.password, 10);

    var consulta = 'SELECT * FROM seguridad.sp_roles(' + id + ',' + body.nombre_rol + ',' + body.activo + ',' + body.uc + ',' + body.um + ');'
    console.log(consulta);

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query(consulta, (err, result) => {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede actualizar la información del Rol',
                    errores: err
                })
            }
            res.status(201).json({
                result: result.rows[0],
                usuariotoken: req.usuario
            });
        })
    });
});


// =====================================================
// Crear un Rol
// =====================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    // var password = bcrypt.hashSync(body.password, 10);
    var consulta = 'SELECT * FROM seguridad.sp_roles(' + body.id_rol + ',' + body.nombre_rol + ',' + body.activo + ',' + body.uc + ',' + body.um + ');'
    console.log(consulta);

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query(consulta, (err, result) => {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede crear el Rol',
                    errores: err
                })
            }

            res.status(201).json({
                result: result.rows[0],
                usuariotoken: req.usuario
            });
        })
    });
});

// =====================================================
// Desactivar un Rol
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    var consulta = 'SELECT * FROM seguridad.sp_del_roles(' + id + ',' + body.um + ');'
    console.log(consulta);

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No es posible conectarse a la base de datos',
                errores: err
            })
        }
        client.query(consulta, (err, result) => {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puede desactivar el Rol',
                    errores: err
                })
            }
            res.status(200).json({
                result: result.rows[0],
                usuariotoken: req.usuario
            });
        })
    });
});

module.exports = app;