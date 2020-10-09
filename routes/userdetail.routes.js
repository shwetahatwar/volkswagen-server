var express = require('express');
var router = express.Router();
var roles = require('../controllers/role.controller');
var userDetails = require('../controllers/userdetail.controller');

router.post("/sign_in", userDetails.getUser,
  userDetails.matchPassword,
  userDetails.sign_in,
  userDetails.sendFindResponse
  );

router.post("/",
  userDetails.loginRequired,
  roles.getAll,
  userDetails.create,
  userDetails.sendCreateResponse);

router.get("/",  userDetails.loginRequired,
  userDetails.findAll,
	userDetails.sendFindResponse);

router.get("/:id",  userDetails.loginRequired,
  userDetails.findOne,
	userDetails.sendFindResponse);

router.put("/:id",  userDetails.loginRequired,
	userDetails.update,
	userDetails.sendCreateResponse);

module.exports = router;