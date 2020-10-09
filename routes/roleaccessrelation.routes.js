var express = require('express');
var router = express.Router();
var roleaccessrelations = require('../controllers/roleaccessrelation.controller');
var users = require('../controllers/userdetail.controller');

router.post("/", users.loginRequired,
	roleaccessrelations.create,
	roleaccessrelations.sendCreateResponse);

router.get("/", users.loginRequired,
	roleaccessrelations.getAll,
	roleaccessrelations.sendFindResponse);

router.get("/:id", users.loginRequired,
	roleaccessrelations.getById,
	roleaccessrelations.sendFindResponse);

router.put('/:id', users.loginRequired,
	roleaccessrelations.update,
	roleaccessrelations.sendCreateResponse);

router.get("/get/validateaccessurl", 
	users.loginRequired,
	roleaccessrelations.validateAccessUrl,
	roleaccessrelations.sendFindResponse);

module.exports = router;