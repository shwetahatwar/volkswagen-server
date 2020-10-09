var express = require('express');
var router = express.Router();
var deviceTables = require('../controllers/devicetable.controller');
var deviceTransactionTables = require('../controllers/devicetransactiontable.controller');
var users = require('../controllers/userdetail.controller');

router.post("/", users.loginRequired,
    deviceTables.create,
	deviceTransactionTables.create,
	deviceTables.sendCreateResponse);

router.get("/",  users.loginRequired,
	deviceTables.findAll,
	deviceTables.sendFindResponse);

router.get("/:id",  users.loginRequired,
	deviceTables.findOne,
	deviceTables.sendFindResponse);

router.put("/:id",  users.loginRequired,
	deviceTables.update,
	deviceTransactionTables.create,
	deviceTables.sendCreateResponse);

module.exports = router;