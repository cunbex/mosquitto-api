const express = require('express');

const adminController = require('../controllers/admin-controller.js');
const deviceController = require('../controllers/device-controller.js');
const checkControllerId = require('../middleware/checkControllerId.js');

const router = express.Router();

// Client PUT endpoints
router.post('/client/update/clientId', adminController.put_clientId);
router.post('/client/update/password', adminController.put_client_password);
router.post('/client/update/record', adminController.put_client);

// Group PUT endpoints
router.post('/group/update/record', adminController.put_group);

// Role PUT endpoints
router.post('/group/update/record', adminController.put_role);

// Controller PUT endpoints
router.post(
    '/controller/update/userId',
    checkControllerId,
    deviceController.put_controller_userId,
);
router.post('/controller/update/topic', deviceController.put_controller_topic);
module.exports = router;
