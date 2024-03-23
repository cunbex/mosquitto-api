const express = require('express');
const mqtt = require('mqtt');
const fs = require('fs');

// Import routes
const getRoutes = require('./get.js');
const postRoutes = require('./post.js');
const deleteRoutes = require('./delete.js');
const putRoutes = require('./put.js');

require('dotenv').config();

// Import CA cert
const ca = fs.readFileSync(process.env.CERT_PATH).toString();

const router = express.Router();

// MQTT broker connection options
const options = {
    clientId: process.env.CLIENT_ID,
    protocolId: 'MQTT',
    protocolVersion: 4,
    keepalive: 120,
    reconnectPeriod: 10 * 1000,
    connectTimeout: 12 * 1000,
    username: process.env.BROKER_USERNAME,
    password: process.env.BROKER_PASSWORD,
    clean: false,
    will: {
        topic: `disconnect/${process.env.CLIENT_ID}`,
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

// Event handlers
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    const publishOptions = {
        qos: 0,
        retain: true,
        dup: false,
    };
    const subscribeOptions = {
        qos: 0,
    };
    client.subscribe(
        [process.env.CONTROL_TOPIC, 'disconnect/#'],
        subscribeOptions,
        (err, granted) => {
            if (err) {
                console.error('Error subscribing to topic:', err);
            } else if (granted) {
                console.log(`Subscribed to: ${JSON.stringify(granted)}`);
            }
        },
    );
    // Middleware to attach mqtt-Client PublishOptions and subscribeOptions to the request object
    router.use((req, res, next) => {
        req.client = client;
        req.publishOptions = publishOptions;
        req.subscribeOptions = subscribeOptions;
        next();
    });
    router.use('/admin', [getRoutes, deleteRoutes, postRoutes, putRoutes]);
});

module.exports = router;
