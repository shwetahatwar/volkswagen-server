const DeviceTransactionTable = require('../models').deviceTransactionTable;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');

//create device transaction on device transaction
exports.create = async(req,res,next) =>{

  var {deviceId , connectionStatus , station} = req.body;
  
  var transaction = {
  	deviceId : deviceId,
    station : station,
    connectionStatus : connectionStatus,
    timestamp : Date.now()
  }

  var transactionData = await DeviceTransactionTable.create(transaction);
  next();
};

// Retrieve all device transaction entry data from the database.
exports.findAll = async (req, res,next) => {
  var {deviceId , timestamp , station , connectionStatus , offset , limit} = req.query;
  var newOffset = 0;
  var newLimit = 100;

  if(offset){
    newOffset = parseInt(offset)
  }

  if(limit){
    newLimit = parseInt(limit)
  }

  var whereClause = new WhereBuilder()
  .clause('connectionStatus', connectionStatus)
  .clause('deviceId', deviceId)
  .clause('station', station)
  .clause('timestamp', timestamp).toJSON();
  
  var transactionData = await DeviceTransactionTable.findAll({ 
    where: whereClause,
    order: [
    ['createdAt', 'DESC'],
    ],
    offset:newOffset,
    limit:newLimit    
  });

  if (!transactionData) {
    return next(HTTPError(400, "Device transaction table data not found"));
  }
  
  req.transactionDataList = transactionData.map ( el => { return el.get({ plain: true }) } );

  next();
};

// Retrieve device transaction table data by id from the database.
exports.findOne = async (req, res, next) => {
  const id = req.params.id;

  var transactionData = await DeviceTransactionTable.findByPk(id);
  if (!transactionData) {
    return next(HTTPError(500, "Device transaction table data not found"))
  }

  req.transactionDataList = transactionData;
  next();
};

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.transactionDataList);
};
