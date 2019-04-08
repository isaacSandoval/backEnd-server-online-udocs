"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var mensajeSchema = new mongoose_1.Schema({
    // id: {type: Schema.Types.ObjectId},
    usuario: { type: String, required: false },
    mensaje: { type: String, required: false }
});
var grupoSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del grupo es requerido']
    },
    grupo: {
        type: String,
        unique: true,
        required: [true, 'El grupo es requerido']
    },
    hora: {
        type: String,
        required: [true, 'La hora es requerida']
    },
    maestro: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'maestroModel',
        required: [true, 'El maestro es requerido']
    },
    usuarios: [{
            type: mongoose_1.Schema.Types.ObjectId, ref: 'usuarioModel',
            required: false
        }],
    mensajes: [mensajeSchema]
});
grupoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico' });
exports.gruposModel = mongoose_2.default.model('grupoModel', grupoSchema, 'grupos');
