var express = require('express');
var router = express.Router();
var masters = require('../controllers/master.controller');

router.post("/", masters.create);
router.get("/", masters.findAll);
router.get("/:id", masters.findOne);
router.put("/:id", masters.update);

module.exports = router;