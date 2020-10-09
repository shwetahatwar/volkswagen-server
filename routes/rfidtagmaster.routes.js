var express = require('express');
var router = express.Router();
var rfidTagMasters = require('../controllers/rfidtagmaster.controller');
var transactionTables = require('../controllers/transactiontable.controller');
var shiftTables = require('../controllers/shifttable.controller');
var users = require('../controllers/userdetail.controller');

router.post("/",  users.loginRequired,
	rfidTagMasters.create,
	transactionTables.create,
	rfidTagMasters.sendCreateResponse);

router.get("/",  users.loginRequired,
	rfidTagMasters.findAll,
	rfidTagMasters.sendFindResponse);

router.get("/:id",  users.loginRequired,
	rfidTagMasters.findOne,
	rfidTagMasters.sendFindResponse);

router.put("/:id", users.loginRequired, 
	rfidTagMasters.update,
	rfidTagMasters.sendUpdateResponse);

router.get("/get/searchdata", users.loginRequired,
	// shiftTables.findByName,
    rfidTagMasters.searchMasterDataByQuery);

router.get("/get/count/mastercount", users.loginRequired,
    rfidTagMasters.countOfRfidMaster);

router.get("/delete/deleterecord", users.loginRequired,
	rfidTagMasters.findAll,
    rfidTagMasters.delete,
	rfidTagMasters.sendDeleteResponse);

module.exports = router;