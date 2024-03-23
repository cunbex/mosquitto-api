const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Import routes
const getRoutes = require('./get.js');
const postRoutes = require('./post.js');
const deleteRoutes = require('./delete.js');
const putRoutes = require('./put.js');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to attach Prisma client to the request object
router.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

router.use('/', [getRoutes, deleteRoutes, postRoutes, putRoutes]);

module.exports = router;
