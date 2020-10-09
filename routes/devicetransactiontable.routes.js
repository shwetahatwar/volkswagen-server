var express = require('express');
var router = express.Router();
var users = require('../controllers/userdetail.controller');
var deviceTransactionTables = require('../controllers/devicetransactiontable.controller');

router.post("/",  users.loginRequired,
	deviceTransactionTables.create,
	deviceTransactionTables.sendCreateResponse);

router.get("/",  users.loginRequired,
	deviceTransactionTables.findAll,
	deviceTransactionTables.sendFindResponse);

router.get("/:id", users.loginRequired, 
	deviceTransactionTables.findOne,
	deviceTransactionTables.sendFindResponse);

router.get("/get/getdevicestatus", users.loginRequired,
	deviceTransactionTables.getDeviceStatus);

module.exports = router;