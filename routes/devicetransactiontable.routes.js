var express = require('express');
var router = express.Router();
var deviceTransactionTables = require('../controllers/devicetransactiontable.controller');

router.post("/", deviceTransactionTables.create,
	deviceTransactionTables.sendCreateResponse);

router.get("/", 
	deviceTransactionTables.findAll,
	deviceTransactionTables.sendFindResponse);

router.get("/:id", 
	deviceTransactionTables.findOne,
	deviceTransactionTables.sendFindResponse);

module.exports = router;