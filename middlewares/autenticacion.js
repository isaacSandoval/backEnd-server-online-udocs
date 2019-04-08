"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
// =================================================================
//-- Verificar token
// =================================================================
exports.verificarToken = function (req, resp, next) {
    var token = req.query.token;
    jsonwebtoken_1.default.verify(token, config_1.SEED, (error, decoded) => {
        if (error) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: error,
                token: token,
                decoded: decoded
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
// =================================================================
//-- Verificar si usuario es maestro o administrador
// =================================================================
exports.verificarUsuario = function (req, resp, next) {
    var usuario = req.usuario;
    if (usuario.role === 'maestro' || usuario.role === 'administrador') {
        next();
        return;
    }
    else {
        return resp.status(401).json({
            mensaje: 'No puede realizar el movimiento, debido a que no es un maestro o administrador de la plataforma'
        });
    }
};
// =================================================================
//-- Verificar si usuario es exactemente administrador
// =================================================================
exports.verificarAdmin = function (req, resp, next) {
    var usuario = req.usuario;
    if (usuario.role === 'administrador') {
        next();
        return;
    }
    else {
        return resp.status(401).json({
            mensaje: 'No puede realizar el movimiento, debido a que no es un administrador de la plataforma'
        });
    }
};
// =================================================================
//-- Verificar si es el mismo usuario que esta editando los datos
// =================================================================
exports.MismoUsuario = function (req, resp, next) {
    var usuario = req.usuario;
    var id = req.params.id;
    if (usuario._id === id) {
        next();
    }
    else {
        return resp.status(401).json({
            mensaje: 'No puedes editar la informacion de otro usuario'
        });
    }
};
