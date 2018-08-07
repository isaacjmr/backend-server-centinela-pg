var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middleware/autenticacion');

var execQuery = require('../centinela/ejecutarconsulta');

// =====================================================
// Listar todos los usuarios
// =====================================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var consulta = 'select * from seguridad.sp_sel_usuarios(0) Order By p_id_usuario Limit 5 Offset ' + desde + ';';

    execQuery.getQuery(res, consulta);

});

// =====================================================
// Listar un Usuario
// =====================================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    var consulta = 'select * from seguridad.sp_sel_usuarios(' + id + ');';

    execQuery.getQuery(res, consulta);

});

// =====================================================
// Actualizar Usuario
// =====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    var body = req.body;
    var password = bcrypt.hashSync(body.password, 10);
    var consulta = 'SELECT * FROM seguridad.sp_usuarios(' + id + ',' + body.nombre + ',' + body.email + ',' + "'" + password + "'" + ',' + body.imagen + ',' + body.id_rol + ',' + body.google + ',' + body.uc + ',' + body.um + ');'

    execQuery.putQuery(res, consulta);

});


// =====================================================
// Crear un Usuario
// =====================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var password = bcrypt.hashSync(body.password, 10);
    var consulta = 'SELECT * FROM seguridad.sp_usuarios(' + body.id_usuario + ',' + body.nombre + ',' + body.email + ',' + "'" + password + "'" + ',' + body.imagen + ',' + body.id_rol + ',' + body.google + ',' + body.uc + ',' + body.um + ');'

    execQuery.postQuery(res, consulta);

});

// =====================================================
// Desactivar un Usuario
// =====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;

    var consulta = 'SELECT * FROM seguridad.sp_del_usuarios(' + id + ',' + body.ui + ');'

    execQuery.delQuery(res, consulta);

});

module.exports = app;