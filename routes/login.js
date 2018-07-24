var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var pg = require('pg');
var bdConf = require('../centinela/bd');


const pool = new pg.Pool(bdConf);

app.post('/', (req, res) => {

    var body = req.body;
    var password = '';

    // var password = bcrypt.hashSync(body.password, 10);
    var consulta = 'Select id_usuario, password, nombre, email, activo From seguridad.usuarios Where email = ' + body.email + ";";
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
                    mensaje: 'Las credenciales del usuario no son válidas - email',
                    errores: err
                })
            }
            usuario = result.rows[0];
            console.log(body.password, usuario.password);
            if (!bcrypt.compareSync(body.password, usuario.password)) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Las credenciales del usuario no son válidas - password',
                    errores: err
                })
            }

            // Crear Token
            usuario.password = ':)';
            var token = jwt.sign({ usuario }, SEED, { expiresIn: 3600 });

            res.status(200).json({
                ok: true,
                mensaje: 'Login post Correcto',
                body: body,
                token: token,
                usuario: usuario.id_usuario
            });
            // res.status(200).send(result.rows);
        })

    });

    /* res.status(200).json({
        ok: true,
        mensaje: 'Login post Correcto',
        body: body
    }); */

});


module.exports = app;