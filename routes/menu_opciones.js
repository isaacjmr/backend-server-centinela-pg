var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middleware/autenticacion');

var pg = require('pg');
var bdConf = require('../centinela/bd');

const pool = new pg.Pool(bdConf);

// =====================================================
// Listar todas las Opciones de Menú
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
        client.query('select * from seguridad.sp_sel_menu_opciones(0);', (err, result) => {
            done();
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pueden cargar las Opciones del Menú',
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
// Actualizar Opción de Menú
// =====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    var body = req.body;
    // var password = bcrypt.hashSync(body.password, 10);

    var consulta = 'SELECT * FROM seguridad.sp_menu_opciones(' + id + ',' + body.nombre_opcion + ',' + body.descripcion + ',' + body.activo + ',' + body.uc + ',' + body.um + ');'
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
                    mensaje: 'No se puede actualizar la información de la Opción de Menú',
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
// Crear una Opción de Menú
// =====================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var consulta = 'SELECT * FROM seguridad.sp_menu_opciones(' + body.id_opcion + ',' + body.nombre_opcion + ',' + body.descripcion + ',' + body.activo + ',' + body.uc + ',' + body.um + ');'
        // console.log(consulta);

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
                    mensaje: 'No se puede crear la Opción del Menú',
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
// Desactivar una Opción de Menú
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    var consulta = 'SELECT * FROM seguridad.sp_del_menu_opciones(' + id + ',' + body.um + ');'
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
                    mensaje: 'No se puede desactivar la Opción del Menú',
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