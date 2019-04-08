"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// EXPRESS
const express_1 = require("express");
// MODELS
const gruposModel_1 = require("../models/gruposModel");
var gruposRouter = express_1.Router();
// =================================================================
//-- Obtener todos los grupos
// =================================================================
gruposRouter.get('/', (req, resp) => {
    gruposModel_1.gruposModel.find()
        // .populate('maestro', 'nombre correo img')
        .populate('usuarios', 'nombre')
        .exec((error, grupos) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                message: 'Error al buscar grupos',
                errors: error
            });
        }
        resp.status(200).json({
            ok: true,
            grupos: grupos
        });
    });
});
// =================================================================
//-- Crear nuevo grupo
// =================================================================
gruposRouter.post('/', (req, resp) => {
    var body = req.body;
    var grupo = new gruposModel_1.gruposModel({
        nombre: body.nombre,
        hora: body.hora,
        grupo: body.grupo,
        maestro: body.maestro
    });
    grupo.save((error, grupoCreado) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                message: 'Error al crear grupo',
                errors: error
            });
        }
        resp.status(200).json({
            ok: true,
            grupo: grupoCreado
        });
    });
});
// =================================================================
//-- Agregar un usuario a un grupo en especifico
// =================================================================
gruposRouter.put('/:id', (req, resp) => {
    var id = req.params.id;
    var body = req.body;
    // AGREGAR USUARIO AL GRUPO
    gruposModel_1.gruposModel.findById(id, (error, grupo) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar grupo',
                errors: error
            });
        }
        if (!grupo) {
            return resp.status(400).json({
                ok: false,
                message: 'No existe un grupo con el id indicado'
            });
        }
        for (let i = 0; i < grupo.usuarios.length; i++) {
            const element = grupo.usuarios[i];
            if (element == body.usuario) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'El usuario ya esta registrado en el grupo'
                });
            }
        }
        grupo.update({ $push: { usuarios: body.usuario } }, (error, grupoActualizado) => {
            if (error) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar grupo'
                });
            }
            resp.status(200).json({
                ok: true,
                grupo: grupoActualizado,
            });
        });
    });
});
// =================================================================
//-- Guardar mensajes de los usuarios en el grupo 
// =================================================================
gruposRouter.put('/:id/mensaje', (req, resp) => {
    var id = req.params.id;
    var body = req.body;
    var mensaje = ({
        usuario: body.usuario,
        mensaje: body.mensaje
    });
    gruposModel_1.gruposModel.findById(id, (error, grupo) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al buscar grupo',
                errors: error
            });
        }
        if (!grupo) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un grupo con el id ingresado'
            });
        }
        grupo.update({ $push: { mensajes: mensaje } }, (error, mensajeEnviado) => {
            if (error) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al enviar el mensaje',
                    errors: error
                });
            }
            resp.status(200).json({
                ok: true,
                mensaje: mensajeEnviado
            });
        });
    });
});
// =================================================================
//-- Eliminar Grupo por ID 
// =================================================================
gruposRouter.delete('/eliminar/:id', (req, resp) => {
    var id = req.params.id;
    gruposModel_1.gruposModel.findByIdAndRemove(id, (error, grupo) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar grupo',
                errors: error
            });
        }
        if (!grupo) {
            return resp.status(400).json({
                ok: false,
                messages: { message: `No existe un grupo con el id ${id}` }
            });
        }
        return resp.status(200).json({
            ok: true,
            grupoEliminado: grupo
        });
    });
});
// gruposRouter.delete('/usuario/:id', (req: Request, resp: Response) => {
//     var id = req.params.id;
//     resp.status(200).json({
//         ok:true,
//         id
//     })
// })
gruposRouter.get('/info/:idGrupo', (req, res) => {
    var id = req.params.idGrupo;
    gruposModel_1.gruposModel.findById(id)
        .populate('usuarios', 'nombre correo img')
        .populate('maestro', 'nombre correo img')
        .exec((error, grupo) => {
        if (error) {
            return res.json({
                ok: false,
                mensaje: 'Error al buscar grupo por id',
                errors: error
            });
        }
        if (!grupo) {
            return res.json({
                ok: true,
                mensaje: `No existe un grupo con el id: ${id}`,
            });
        }
        res.json({
            ok: true,
            grupo
        });
    });
});
exports.default = gruposRouter;
