const TransactionTable = require('../models').transactionTable;
const Sequelize = require("sequelize");
const RFIDTagMaster = require('../models').rfidTagMaster;
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');

//create transaction entry on creation of rfid tag master
exports.create = async(req,res,next) =>{
  var transactionType = req.transactionType;	

  var transaction = {
  	rfidMasterId: req.createdMasterData.id,
    timestamp: Date.now(),
    transactionType:transactionType
  }

  var transactionData = await TransactionTable.create(transaction);
  next();
}

//create transaction entry
exports.createTransaction = async(req,res,next) =>{
  var {transactionType , rfidMasterId } = req.body;  

  var transaction = {
    rfidMasterId: rfidMasterId,
    timestamp: Date.now(),
    transactionType:transactionType
  }

  var transactionData = await TransactionTable.create(transaction);
  next();
}

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

// Retrieve all transaction entry data from the database.
exports.findAll = async (req, res,next) => {
  var {rfidMasterId , timestamp , transactionType , offset , limit} = req.query;
  var newOffset = 0;
  var newLimit = 100;

  if(offset){
    newOffset = parseInt(offset)
  }

  if(limit){
    newLimit = parseInt(limit)
  }

  var whereClause = new WhereBuilder()
  .clause('timestamp', timestamp)
  .clause('transactionType', transactionType)
  .clause('rfidMasterId', rfidMasterId).toJSON();
  
  var transactionData = await TransactionTable.findAll({ 
    where: whereClause,
    order: [
    ['createdAt', 'DESC'],
    ],
    include: [
    {
    	model: RFIDTagMaster
    }
    ],
    offset:newOffset,
    limit:newLimit    
  });

  if (!transactionData) {
    return next(HTTPError(400, "Transaction table data not found"));
  }
  
  req.transactionDataList = transactionData.map ( el => { return el.get({ plain: true }) } );

  next();
};

// Retrieve transaction table data by id from the database.
exports.findOne = async (req, res, next) => {
  const id = req.params.id;

  var transactionData = await TransactionTable.findByPk(id);
  if (!transactionData) {
    return next(HTTPError(500, "Transaction table data not found"))
  }

  req.transactionDataList = transactionData;
  next();
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.transactionDataList);
};
