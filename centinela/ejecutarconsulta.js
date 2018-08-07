var pg = require('pg');
var bdConf = require('../centinela/bd');

const pool = new pg.Pool(bdConf);

module.exports.getQuery = function getQuery(res, query) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se puede extraer la información de la base de datos',
                    errores: err
                })
                reject(res)
            }
            client.query(query, (err, result) => {
                done();
                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede extraer la información de la tabla correspondiente',
                        errores: err
                    })
                    reject(res)
                }
                res.status(200).json({
                    ok: true,
                    result: result.rows,
                    totalregistros: result.rows[0].p_total_registros
                });
                resolve(res);
            })
        })
    });
};

module.exports.getOneQuery = function getOneQuery(res, query) {
    var resultado = {};

    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se puede extraer la información de la base de datos',
                    errores: err
                })
                reject(res)
            }
            client.query(query, (err, result) => {
                done();
                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede extraer la información de la tabla correspondiente',
                        errores: err
                    })
                    reject(res)
                }
                resultado = result.rows;

                /* res.status(200).json({
                    ok: true,
                    result: result.rows,
                    totalregistros: result.rows[0].p_total_registros
                }); */

                resolve(resultado);
            })
        })
    });
};

module.exports.putQuery = function putQuery(res, query) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No es posible conectarse a la base de datos',
                    errores: err
                })
                reject(res)
            }
            client.query(query, (err, result) => {
                done();
                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede actualizar la información del Registro',
                        errores: err
                    })
                    reject(res)
                }
                res.status(201).json({
                    ok: true,
                    result: result.rows[0]
                });
                resolve(res);
            })
        })
    });
};

module.exports.postQuery = function postQuery(res, query) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No es posible conectarse a la base de datos',
                    errores: err
                })
                reject(res)
            }
            client.query(query, (err, result) => {
                done();
                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede crear el Registro',
                        errores: err
                    })
                    reject(res)
                }
                res.status(201).json({
                    ok: true,
                    result: result.rows[0]
                });
                resolve(res);
            })
        })
    });
};

module.exports.delQuery = function delQuery(res, query) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No es posible conectarse a la base de datos',
                    errores: err
                })
                reject(res)
            }
            client.query(query, (err, result) => {
                done();
                if (err) {
                    res.status(400).json({
                        ok: false,
                        mensaje: 'No se puede desactivar el Registro',
                        errores: err
                    })
                    reject(res)
                }
                res.status(201).json({
                    ok: true,
                    result: result.rows[0]
                });
                resolve(res);
            })
        })
    });
};