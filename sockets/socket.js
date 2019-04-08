"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desconectar = (usuario) => {
    usuario.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
};
// Escuchar mensajes
exports.mensaje = (usuario, io) => {
    usuario.on('mensaje', (payload, callback) => {
        console.log('mensaje Recibido', payload);
        io.emit('mensaje-nuevo', payload);
    });
};
