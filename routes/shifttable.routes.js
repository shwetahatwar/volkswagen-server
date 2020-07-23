var express = require('express');
var router = express.Router();
var shiftTables = require('../controllers/shifttable.controller');

router.post("/", shiftTables.create,
	shiftTables.sendCreateResponse);

router.get("/", shiftTables.findAll,
	shiftTables.sendFindResponse);

router.get("/:id", shiftTables.findOne,
	shiftTables.sendFindResponse);

router.put("/:id", 
	shiftTables.update,
	shiftTables.sendCreateResponse);

module.exports = router;