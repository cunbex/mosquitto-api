const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const mqtt = require('mqtt');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Import routes
const getRoutes = require('./routes/get.js');
const postRoutes = require('./routes/post.js');
const deleteRoutes = require('./routes/delete.js');
const putRoutes = require('./routes/put.js');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Import CA cert
const ca = fs.readFileSync(process.env.CERT_PATH).toString();

const publishOptions = {
    qos: 1,
    retain: true,
    dup: false,
};
const subscribeOptions = {
    qos: 1,
};

require('dotenv').config();
// Use CORS
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware to attach Prisma client to the request object
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// MQTT broker connection options
const options = {
    clientId: process.env.CLIENT_ID,
    protocolId: 'MQTT',
    protocolVersion: 4,
    keepalive: 3600,
    reconnectPeriod: 5 * 1000,
    connectTimeout: 6 * 1000,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
    will: {
        topic: `${process.env.CLIENT_ID}/lwt`,
        payload: `${process.env.CLIENT_ID} disconnected without a reason`,
        qos: 0,
        retain: false,
    },
    ca,
};

// MQTT broker URL
const brokerUrl = process.env.BROKER_URL;

// Create MQTT client instance
const client = mqtt.connect(brokerUrl, options);

// Middleware to attach mqtt-Client PublishOptions and subscribeOptions to the request object
app.use((req, res, next) => {
    req.client = client;
    req.publishOptions = publishOptions;
    req.subscribeOptions = subscribeOptions;
    next();
});

app.use('/api', [getRoutes, deleteRoutes, postRoutes, putRoutes]);

// Event handlers
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

client.on('reconnect', () => {
    console.log('Reconnecting...');
});
client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
});

client.on('close', () => {
    console.log('Disconnecting...');
});

client.on('error', (err) => {
    console.error('MQTT client error:', err);
});

client.subscribe(
    [process.env.CONTROL_TOPIC, `${process.env.CLIENT_ID}/lwt`],
    subscribeOptions,
    (err, granted) => {
        if (err) {
            console.error('Error subscribing to topic:', err);
        } else if (granted) {
            console.log(`Subscribed to: ${JSON.stringify(granted)}`);
        }
    },
);

// GET root endpoint
app.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        status: 200,
        message: 'Api is up',
    });
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(errorHandler);
module.exports = app;
