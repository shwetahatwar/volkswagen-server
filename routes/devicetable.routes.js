var express = require('express');
var router = express.Router();
var deviceTables = require('../controllers/devicetable.controller');
var deviceTransactionTables = require('../controllers/devicetransactiontable.controller');

router.post("/", deviceTables.create,
	deviceTransactionTables.create,
	deviceTables.sendCreateResponse);

router.get("/", deviceTables.findAll,
	deviceTables.sendFindResponse);

router.get("/:id", deviceTables.findOne,
	deviceTables.sendFindResponse);

router.put("/:id", 
	deviceTables.update,
	deviceTransactionTables.create,
	deviceTables.sendCreateResponse);

module.exports = router;