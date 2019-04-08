"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const enviroments_1 = require("./global/enviroments");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// Archivos de rutas
const gruposRoutes_1 = __importDefault(require("./routes/gruposRoutes"));
const usuariosRoutes_1 = __importDefault(require("./routes/usuariosRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const maestrosRoutes_1 = __importDefault(require("./routes/maestrosRoutes"));
const mensajesRoutes_1 = __importDefault(require("./routes/mensajesRoutes"));
const server = server_1.default.Instance;
// Body Parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Conectandonos a mongoose
mongoose_1.default.connect('mongodb://udocs:password1664413@ds163689.mlab.com:63689/udocs-server-pi', { useNewUrlParser: true }, (error) => {
    if (error) {
        throw error;
    }
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
// Rutas
server.app.use('/usuarios', usuariosRoutes_1.default);
server.app.use('/grupos', gruposRoutes_1.default);
server.app.use('/maestros', maestrosRoutes_1.default);
server.app.use('/mensajes', mensajesRoutes_1.default);
server.app.use('/login', loginRoutes_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${enviroments_1.SERVER_PORT}`);
});
