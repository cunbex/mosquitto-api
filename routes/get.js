const express = require('express');

const adminController = require('../controllers/admin-controller.js');
const deviceController = require('../controllers/device-controller.js');

const router = express.Router();

// GET endpoints
router.get('/client/get/all', adminController.get_client_list);
router.get('/group/get/all', adminController.get_group_list);
router.get('/role/get/all', adminController.get_role_list);

// Controller POST endpoints
router.get('/controller/get/all', deviceController.get_controller_list);

module.exports = router;
