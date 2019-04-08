"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// EXPRESS
const express_1 = require("express");
// MODELS
const usuarioModel_1 = require("../models/usuarioModel");
const gruposModel_1 = require("../models/gruposModel");
// ENRIPT PASSWORD
const bcrypt_1 = __importDefault(require("bcrypt"));
// JSONWEBTOKENS
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
// MIDDLEWARES
const autenticacion_1 = require("../middlewares/autenticacion");
// CONFG ROUTER
const usuariosRouter = express_1.Router();
// =================================================================
//-- Obtener los usuarios registrados
// =================================================================
usuariosRouter.get('/', (req, resp) => {
    usuarioModel_1.usuarioModel.find()
        .populate('grupos', 'nombre hora grupo maestro')
        .exec((error, usuarios) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                errors: error,
                mensaje: 'Error al obtener los usuarios'
            });
        }
        usuarioModel_1.usuarioModel.count({}, (error, usuariosTotales) => {
            if (error) {
                return resp.status(400).json({
                    ok: false,
                    errors: error,
                    message: 'Error al contar usuarios'
                });
            }
            resp.status(200).json({
                ok: true,
                totalUsuarios: usuariosTotales,
                usuarios: usuarios
            });
        });
    });
});
// =================================================================
//-- Actualizar un usuario
// =================================================================
usuariosRouter.put('/:id', [autenticacion_1.verificarToken, autenticacion_1.MismoUsuario], (req, res) => {
    var id = req.params.id;
    var body = req.body;
    usuarioModel_1.usuarioModel.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: 'No existe un usuario con este id' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.correo = body.correo;
        usuario.role = body.role;
        usuario.descripcion = body.descripcion;
        usuario.semestre = parseInt(body.semestre, 10);
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
});
// =================================================================
//-- Crear Usuario Nuevo
// =================================================================
usuariosRouter.post('/', (req, resp) => {
    var body = req.body;
    var usuario = new usuarioModel_1.usuarioModel({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt_1.default.hashSync(body.password, 10),
        img: body.img,
        portada: body.portada,
        role: body.role
    });
    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                errors: error,
                mensaje: 'Error al crear usuario'
            });
        }
        resp.status(200).json({
            ok: true,
            usuarioGuardado: usuarioGuardado
        });
    });
});
// =================================================================
//-- Eliminar usuario
// =================================================================
usuariosRouter.delete('/:id', (req, resp) => {
    var id = req.params.id;
    usuarioModel_1.usuarioModel.findByIdAndRemove(id, (error, usuarioEliminado) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                errors: error,
                mensaje: 'Error al eliminar usuario'
            });
        }
        if (!usuarioEliminado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id'
            });
        }
        resp.status(200).json({
            ok: true,
            eliminado: usuarioEliminado
        });
    });
});
// =================================================================
//-- Obtener grupos a los que estan registrados
// =================================================================
usuariosRouter.get('/grupos/:idUsuario', (req, resp) => {
    var idUsuario = req.params.idUsuario;
    gruposModel_1.gruposModel.find({ usuarios: idUsuario }, 'nombre id')
        .exec((err, usuarios) => {
        resp.json({
            grupos: usuarios
        });
    });
});
// =================================================================
//-- Obtener informacion del usuario por ID
// =================================================================
usuariosRouter.get('/:id', (req, resp) => {
    var id = req.params.id;
    usuarioModel_1.usuarioModel.findById(id, (error, usuario) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                mensaje: `Error al buscar usuario con el id: ${id}`,
                errors: error
            });
        }
        resp.status(200).json({
            ok: true,
            usuario: usuario
        });
    });
});
// =================================================================
//-- Decodificar Token para detectar informacion
// =================================================================
usuariosRouter.post('/token', (req, resp) => {
    var body = req.body;
    var token = body.token;
    var decoded = jwt_decode_1.default(token);
    resp.status(200).json({
        ok: true,
        informacion: decoded
    });
});
// =================================================================
//-- Actualizar informacion de nuevos usuarios
// =================================================================
usuariosRouter.put('/nuevoUsuario/:id', (req, resp, next) => {
    var body = req.body;
    var id = req.params.id;
    usuarioModel_1.usuarioModel.findById(id, (error, usuario) => {
        if (error) {
            return resp.status(401).json({
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        if (!usuario) {
            return resp.status(401).json({
                mensaje: `No existe un usuario con el id ${id}`
            });
        }
        usuario.puntual = body.puntual;
        usuario.responsable = body.responsable;
        usuario.trabajador = body.trabajador;
        usuario.semestre = body.semestre;
        usuario.universidad = body.universidad;
        usuario.save((error, usuarioActualizado) => {
            if (error) {
                return resp.status(400).json({
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }
            // RENOVAR TOKEN DEL USUARIO ACTUALMENTE LOGEADO
            usuarioActualizado.password = 'encryptpassword';
            var token = jsonwebtoken_1.default.sign({ usuario: usuarioActualizado }, config_1.SEED, { expiresIn: 36000 });
            resp.status(200).json({
                ok: true,
                usuario: usuarioActualizado,
                token: token
            });
        });
    });
});
exports.default = usuariosRouter;
