var express = require('express');
var router = express.Router();
var transactionTables = require('../controllers/transactiontable.controller');

router.post("/", transactionTables.createTransaction,
	transactionTables.sendCreateResponse);

router.get("/", 
	transactionTables.findAll,
	transactionTables.sendFindResponse);

router.get("/:id", 
	transactionTables.findOne,
	transactionTables.sendFindResponse);

module.exports = router;