const express = require('express');

const adminController = require('../controllers/admin-controller.js');
const deviceController = require('../controllers/device-controller.js');
const checkControllerId = require('../middleware/checkControllerId.js');

const router = express.Router();

// Client DELETE endpoints
router.post('/client/delete/record', adminController.delete_client);
router.post('/client/delete/role', adminController.delete_client_role);
router.post('/client/delete/group', adminController.delete_client_group);

// Group DELETE endpoints
router.post('/group/delete/record', adminController.delete_group);
router.post('/group/delete/role', adminController.delete_group_role);

// Role DELETE endpoints
router.post('/role/delete/record', adminController.delete_role);
router.post('/role/delete/acl', adminController.delete_role_acl);

// Controller DELETE endpoints
router.post(
    '/controller/delete/record',
    checkControllerId,
    deviceController.delete_controller,
);
router.post(
    '/controller/delete/topic',
    deviceController.delete_controller_topic,
);

module.exports = router;
