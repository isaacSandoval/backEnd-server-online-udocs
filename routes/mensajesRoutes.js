"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioModel_1 = require("../models/usuarioModel");
const mensajeRouter = express_1.Router();
mensajeRouter.post('/:idUsuario', (req, res) => {
    var id = req.params.idUsuario;
    var body = req.body;
    usuarioModel_1.usuarioModel.findById(id, (error, usuario) => {
        if (error) {
            return res.json({
                ok: false,
                errors: error
            });
        }
        if (!usuario) {
            return res.json({
                ok: false,
                mensaje: 'No existe el usuario'
            });
        }
        var mensaje = {
            usuario: body.para,
            mensajes: body.mensaje
        };
        var arregloAmigos = usuario.amigos;
        for (let i = 0; i < arregloAmigos.length; i++) {
            var infoAmigo = arregloAmigos[i];
            var amigo = arregloAmigos[i].usuario;
            if (amigo === mensaje.usuario) {
                infoAmigo.mensajes.push(mensaje.mensajes);
                return res.json({
                    ok: 'usuario ya existente'
                });
            }
        }
        usuario.update({ $push: { amigos: mensaje } }, (error, usuarioActualizado) => {
            if (error) {
                return res.json({
                    ok: false,
                    mensaje: 'Error al actualizar mensaje del usuario',
                    errors: error
                });
            }
            res.json({
                usuarioNuevo: usuarioActualizado
            });
        });
    });
});
exports.default = mensajeRouter;
