const express = require('express');

const adminController = require('../controllers/admin-controller.js');
const deviceController = require('../controllers/device-controller.js');

const router = express.Router();

// Client POST endpoints
router.post('/client/get/record', adminController.get_client_by_name);
router.post('/client/add/record', adminController.post_client);
router.post('/client/enable/record', adminController.post_enable_client);
router.post('/client/add/role', adminController.post_client_role);
router.post('/client/add/group', adminController.post_client_group);

// Group POST endpoints
router.post('/group/get/record', adminController.get_group_by_name);
router.post('/group/add/record', adminController.post_group);
router.post('/group/add/role', adminController.post_group_role);

// Role POST endpoints
router.post('/role/get/record', adminController.get_role_by_name);
router.post('/role/add/record', adminController.post_role);
router.post('/role/add/acl', adminController.post_acl_role);

// Controller POST endpoints
router.post('/controller/get/record', deviceController.get_controller_by_id);
router.post('/controller/post/record', deviceController.post_controller);

module.exports = router;
