const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const { dbConnect } = require('../src/database/connect.db');
const v1Router = require('../src/v1/routers/v1.router');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || process.env.DEV_PORT || 5000;

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const server = express();

// Middlewares
server.use(cors(corsOptions));
server.use(helmet());
server.use(express.json());

// API routes
server.use('/api/v1', v1Router);

// 404 handler
server.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'The requested resource was not found on this server.',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});


server.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ${err.stack}`);

    res.status(err.statusCode || 500).json({
        success: false,
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});


// Start the server
async function startServer() {
    try {
        await dbConnect();
        server.listen(PORT, () => {
            console.log(`[${NODE_ENV.toUpperCase()}] Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
