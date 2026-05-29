import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/dbConfig.js';
import routes from './routes/index.js';

dotenv.config();
console.log(process.env.MONGO_URL);

// Cargar modelos
import './models/Permission.js';
import './models/Roles.js';
import './models/User.js';
import "./models/Tournament.js";
import "./models/Team.js";
import "./models/Match.js";
import "./models/User.js"
import "./models/Player.js";
const app = express();

// Configuración de CORS más segura y específica
//Intercambio de recursos de origen cruzado

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || !allowedOrigins?.length || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // 24 horas en segundos
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(json());

// Rutas
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

//Endpoint de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando' });
});

// Iniciar conexión a MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🌍 Accede en: http://localhost:${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
     console.log('Error no manejado:', err);
    process.exit(1);
});
