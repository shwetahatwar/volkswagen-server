var express = require('express');
var router = express.Router();
var rfidTagMasters = require('../controllers/rfidtagmaster.controller');
var transactionTables = require('../controllers/transactiontable.controller');
var shiftTables = require('../controllers/shifttable.controller');

router.post("/", rfidTagMasters.create,
	transactionTables.create,
	rfidTagMasters.sendCreateResponse);

router.get("/", rfidTagMasters.findAll,
	rfidTagMasters.sendFindResponse);

router.get("/:id", rfidTagMasters.findOne,
	rfidTagMasters.sendFindResponse);

router.put("/:id", 
	rfidTagMasters.update,
	rfidTagMasters.sendUpdateResponse);

router.get("/get/searchdata",
	shiftTables.findByName,
    rfidTagMasters.searchMasterDataByQuery);

module.exports = router;