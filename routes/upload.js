var express = require('express');
var app = express();
var fs = require('fs');
var fileUpload = require('express-fileupload');
var eQuery = require('../centinela/ejecutarconsulta');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validación de tipos de colección
    var tiposValidos = ['usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de Colección no Válida',
            errors: { message: 'Tipo de Colección no Válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validación de extensiones permitidas
    var extensionesValidas = ['png', 'gif', 'jpg', 'jpeg', 'bmp'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de Archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover el archivo del temporal a un path o ubicación específica
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    var resultado = {};
    if (tipo === 'usuarios') {
        var consulta = 'select * from seguridad.sp_sel_usuarios(' + id + ');';
        eQuery.getOneQuery(resultado, consulta).then(data => {

            var pathViejo = './uploads/usuarios/' + data[0].p_imagen;

            // Elimina la imagen anterior del registro
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            var query = 'SELECT * FROM seguridad.sp_usuarios(' + id + ',' + "'" + data[0].p_nombre + "'" + ',' + "'" + data[0].p_email + "'" + ',' + "'" + data[0].p_password + "'" + ',' + "'" + nombreArchivo + "'" + ',' + data[0].p_id_rol + ',NULL,' + "'" + data[0].p_uc + "'" + ',' + "'" + data[0].p_um + "'" + ');'
            eQuery.putQuery(res, query);

        });
    }
}

module.exports = app;