var express = require('express');
var router = express.Router();
var shiftTables = require('../controllers/shifttable.controller');
var users = require('../controllers/userdetail.controller');

router.post("/",  users.loginRequired,
	shiftTables.create,
	shiftTables.sendCreateResponse);

router.get("/",  users.loginRequired,
	shiftTables.findAll,
	shiftTables.sendFindResponse);

router.get("/:id", users.loginRequired,
    shiftTables.findOne,
	shiftTables.sendFindResponse);

router.put("/:id",  users.loginRequired,
	shiftTables.update,
	shiftTables.sendCreateResponse);

module.exports = router;