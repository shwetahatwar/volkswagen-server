var express = require('express');
var router = express.Router();
var userDetails = require('../controllers/userdetail.controller');

router.post("/", userDetails.create,
	userDetails.sendCreateResponse);

router.get("/", userDetails.findAll,
	userDetails.sendFindResponse);

router.get("/:id", userDetails.findOne,
	userDetails.sendFindResponse);

router.put("/:id", 
	userDetails.update,
	userDetails.sendCreateResponse);

module.exports = router;