"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maestrosModel_1 = require("../models/maestrosModel");
const gruposModel_1 = require("../models/gruposModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const maestroRouter = express_1.Router();
// =================================================================
//-- Obtener todos los maestros registrados
// =================================================================
maestroRouter.get('/', (req, resp) => {
    maestrosModel_1.maestroModel.find({}, (error, maestros) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al buscar maestros',
                errors: error
            });
        }
        resp.status(200).json({
            ok: true,
            maestros: maestros
        });
    });
});
// =================================================================
//-- Registrar un maestro nuevo
// =================================================================
maestroRouter.post('/', (req, resp) => {
    var body = req.body;
    var maestro = new maestrosModel_1.maestroModel({
        nombre: body.nombre,
        correo: body.correo,
        password: bcrypt_1.default.hashSync(body.password, 10)
    });
    maestro.save((error, maestroGuardado) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear maestro',
                errors: error
            });
        }
        resp.status(200).json({
            ok: true,
            maestro: maestroGuardado
        });
    });
});
// =================================================================
//-- Actualizar Informacion del maestro
// =================================================================
maestroRouter.put('/:id', (req, resp) => {
    var id = req.params.id;
    var body = req.body;
    maestrosModel_1.maestroModel.findById(id, (error, maestroDB) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al buscar maestro por id',
                errors: error
            });
        }
        if (!maestroDB) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un maestro con este id'
            });
        }
        maestroDB.nombre = body.nombre;
        maestroDB.correo = body.correo;
        maestroDB.save((error, maestroActualizado) => {
            if (error) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el maestro',
                    errors: error
                });
            }
            resp.status(200).json({
                ok: true,
                maestroActualizado: maestroActualizado
            });
        });
    });
});
// =================================================================
//-- Eliminar maestro por ID
// =================================================================
maestroRouter.delete('/:id', (req, resp) => {
    var id = req.params.id;
    maestrosModel_1.maestroModel.findByIdAndRemove(id, (error, maestro) => {
        if (error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar grupos',
                errors: error
            });
        }
        if (!maestro) {
            return resp.status(400).json({
                ok: false,
                mensaje: `No existe un maestro con el id ${id}`
            });
        }
        resp.status(200).json({
            ok: true,
            maestro: maestro
        });
    });
});
// =================================================================
//-- Obtener grupo registrado de cada maestro
// =================================================================
maestroRouter.get('/:id/grupos', (req, resp) => {
    var id = req.params.id;
    gruposModel_1.gruposModel.find({ maestro: id }, 'nombre grupo hora maestro', (error, grupos) => {
        if (error) {
            return resp.status(500).json({
                mensaje: 'Error al buscar los grupos',
                errors: error
            });
        }
        if (!grupos) {
            return resp.status(400).json({
                ok: false,
                mensaje: `El maestro con el id: ${id} no cuenta con grupos registrados`,
            });
        }
        resp.status(200).json({
            ok: true,
            grupos: grupos
        });
    });
});
exports.default = maestroRouter;
