var express = require('express');
var router = express.Router();
var transactionTables = require('../controllers/transactiontable.controller');
var users = require('../controllers/userdetail.controller');

router.post("/",  users.loginRequired,
	transactionTables.createTransaction,
	transactionTables.sendCreateResponse);

router.get("/",  users.loginRequired,
	transactionTables.findAll,
	transactionTables.sendFindResponse);

router.get("/:id",  users.loginRequired,
	transactionTables.findOne,
	transactionTables.sendFindResponse);


module.exports = router;