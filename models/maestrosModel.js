"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var maestroSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    role: {
        type: String,
        default: 'maestro'
    },
    password: {
        type: String,
        required: [true, 'El password es requerido']
    },
    img: {
        type: String,
        default: null,
        required: false
    }
});
maestroSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico' });
exports.maestroModel = mongoose_2.default.model('maestroModel', maestroSchema, 'maestros');
