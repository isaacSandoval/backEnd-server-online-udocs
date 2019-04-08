"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var rolesAdmitidos = {
    values: ['estudiante', 'maestro', 'administrador'],
    message: '{VALUE}  no es un rol permitido'
};
var amigosSchema = new mongoose_1.Schema({
    usuario: { type: String, required: false },
    mensajes: [{ type: String, required: false }]
});
const UsuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerido']
    },
    img: {
        type: String,
        required: false,
        default: 'no-image'
    },
    portada: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'estudiante',
        enum: rolesAdmitidos
    },
    descripcion: {
        type: String,
        required: false,
        default: ''
    },
    // AUTOEVAULUACION
    puntual: {
        type: Number,
        required: false,
        default: ''
    },
    responsable: {
        type: Number,
        required: false,
        default: ''
    },
    trabajador: {
        type: Number,
        required: false,
        default: ''
    },
    // INFORMACION ACADEMICA
    universidad: {
        type: String,
        required: false,
        default: ''
    },
    semestre: {
        type: Number,
        default: '1'
    },
    // Informacion de contacto
    telefono: {
        type: Number,
        required: false
    },
    celular: {
        type: Number,
        required: false
    },
    correoUniversitario: {
        type: String,
        required: false
    },
    // EXPERIENCIA LABORAL
    empresa: {
        type: String,
        required: false
    },
    periodo: {
        type: String,
        required: false
    },
    labor: {
        type: String,
        required: false
    },
    amigos: [amigosSchema]
});
UsuarioSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico' });
exports.usuarioModel = mongoose_2.default.model('usuarioModel', UsuarioSchema, 'usuarios');
