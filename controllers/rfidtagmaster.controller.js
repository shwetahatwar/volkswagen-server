const RFIDTagMaster = require('../models').rfidTagMaster;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');
const createTransaction = require('../functions/createTransactionDetails');
const TransactionTable = require('../models').transactionTable;

// Create and Save a new rfid tag master
exports.create = async (req, res ,next) => {
  var { vinNumber , pinNumber , epcId } = req.body;
  if (!vinNumber || !pinNumber || !epcId ) {
    return next(HTTPError(400, "Content cannot be empty!"))
  }

  const date = new Date();
  let hours = date.getHours();
  console.log("hours",hours);
  var shift="C";
  if(hours >= 6 && hours <=14.5){
    shift="A"
  }
  else if(hours >= 14.5 && hours <=23){
    shift="B"
  }

  var master = {
    vinNumber: vinNumber,
    pinNumber: pinNumber,
    epcId: epcId,
    entryTimestamp:Date.now(),
    verifiedTimestamp:0,
    entryStation:"CP6",
    verifiedStation:"",
    entryShift: shift,
    verifiyingShift: "",
    isActive: true,
    hall: req.user.hall,
    createdBy: req.user.name,
    updatedBy: req.user.name
  };
  console.log(shift)
  req.transactionType="Entry";

  var checkMasterData = await RFIDTagMaster.findAll({
    where:{
      vinNumber: vinNumber
    }
  });

  // console.log(checkMasterData);
  if (checkMasterData[0]) {
    return next(HTTPError(400, "VIN Number already exist in Database"));
  }
  // console.log(checkMasterData);

  var checkMasterData = await RFIDTagMaster.findAll({
    where:{
      epcId: epcId
    }
  });

  if (checkMasterData[0]) {
    return next(HTTPError(400, "TAG Id already exist in Database"));
  }

  var checkMasterData = await RFIDTagMaster.findAll({
    where:{
      pinNumber: pinNumber
    }
  });

  if (checkMasterData[0]) {
    return next(HTTPError(400, "PIN Number already exist in Database"));
  }
  // console.log(checkMasterData);

  var masterData;
  try {
    masterData = await RFIDTagMaster.create(master)
    if (!masterData) {
      return next(HTTPError(500, "RFID tag master data not created"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the RFID tag master data."))
    }
  }

  req.createdMasterData = masterData.toJSON();

  next();
};

//Update rfid tag master
exports.update = async (req, res,next) => {
  const id = req.params.id;
  var { epcId , vinNumber , pinNumber,isActive } = req.body;
  
  updateData = new WhereBuilder()
  .clause('epcId', epcId)
  .clause('vinNumber', vinNumber)
  .clause('isActive', isActive)  
  .clause('updatedBy', req.user.name)  
  .clause('pinNumber', pinNumber).toJSON();
  try{
    var updatedMasterData = await RFIDTagMaster.update(updateData, {
      where: {
        id: id
      }
    })
    if (!updatedMasterData) {
      return next(HTTPError(500, "RFID tag master data not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the RFID tag master data."))
    }
  }

  if(isActive){
    if(isActive == "true" || isActive == 1){
      req.transactionType="Activate";
    }
    else{
      req.transactionType="Deactivate";
    }
    console.log("transactionType",req.transactionType);
    var transactionData = await createTransaction.createUpdateTransaction(id,req.transactionType)
  }

  req.updatedMasterData = updatedMasterData;
  next();    
};

// Retrieve all rfid tag master data from the database.
exports.findAll = async (req, res,next) => {
  var {epcId , pinNumber , vinNumber ,entryStation , verifiedStation , isActive , offset , limit} = req.query;
  var newOffset = 0;
  var newLimit = 100;

  if(offset){
    newOffset = parseInt(offset)
  }

  if(limit){
    newLimit = parseInt(limit)
  }

  var whereClause = new WhereBuilder()
  .clause('epcId', epcId)
  .clause('pinNumber', pinNumber)
  .clause('isActive', isActive)
  .clause('entryStation', entryStation)
  .clause('verifiedStation', verifiedStation)
  .clause('vinNumber', vinNumber).toJSON();

  var masterData;
  if(verifiedStation=="CP8"){
    masterData = await RFIDTagMaster.findAll({
      where:whereClause,
      order: [
      ['updatedAt', 'DESC'],
      ],
      offset:newOffset,
      limit:newLimit
    }); 
  }
  else{
    masterData = await RFIDTagMaster.findAll({
      where:whereClause,
      order: [
      ['id', 'DESC'],
      ],
      offset:newOffset,
      limit:newLimit
    }); 
  }

  if (!masterData) {
    return next(HTTPError(400, "RFID tag master data not found"));
  }

  if(masterData && masterData.length == 1){
    console.log("In verifiedStation");
    if(epcId && pinNumber && vinNumber){
      var transactionData = await createTransaction.updateRFIDMMasterAndCreateTransaction(masterData[0],req.user.name)
    }
  }

  req.masterDataList = masterData.map ( el => { return el.get({ plain: true }) } );

  next();
};

//get rfid tag master data by id
exports.findOne = async (req, res ,next) => {
  const id = req.params.id;

  var masterData = await RFIDTagMaster.findByPk(id);
  if (!masterData) {
    return next(HTTPError(500, "RFID tag master data not found"))
  }

  req.masterDataList = masterData;
  next();
};

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send(req.createdMasterData);
};

exports.sendUpdateResponse = async (req, res, next) => {
  res.status(200).send({message: "RFID tag master data updated"});
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.masterDataList);
};


//search query
exports.searchMasterDataByQuery = async (req, res,next) => {
  var { createdAtStart , createdAtEnd , hall ,shift ,offset, limit , epcId , vinNumber , pinNumber , entryStation , verifiedStation } = req.query;

  var newOffset = 0;
  var newLimit = 100;

  if(offset){
    newOffset = parseInt(offset)
  }

  if(limit){
    newLimit = parseInt(limit)
  }

  // if(req.shiftNameData){
  //   console.log("shift details",req.shiftNameData);
  //   var startTime = createdAtStart.toString() +" "+ req.shiftNameData["startTime"].toString();
  //   var endTime = createdAtStart +" "+ req.shiftNameData["endTime"];
  //   var dt = new Date(startTime);
  //   console.log(startTime,dt)
  //   createdAtStart = dt.setSeconds( dt.getSeconds());
  //    dt = new Date(endTime);
  //   createdAtEnd = dt.setSeconds( dt.getSeconds());
  //   console.log(createdAtStart,createdAtEnd)
  // }

  if(!epcId){
    epcId="";
  }
  if(!vinNumber){
    vinNumber="";
  }
  if(!pinNumber){
    pinNumber="";
  }
  var whereClause = {};
  if(createdAtStart && createdAtEnd){
    if(verifiedStation=="CP8"){
      if(shift){
        whereClause.verifiyingShift = shift
      }
      whereClause.verifiedTimestamp = {
        [Op.gte]: parseInt(createdAtStart),
        [Op.lt]: parseInt(createdAtEnd),
      }
    }
    else{
      if(shift){
        whereClause.entryShift = shift
      }
      whereClause.entryTimestamp = {
        [Op.gte]: parseInt(createdAtStart),
        [Op.lt]: parseInt(createdAtEnd),
      }
    }
  }

  if(epcId){
    whereClause.epcId = {
      [Op.like]:'%'+epcId+'%'
    };
  }

  if(vinNumber){
    whereClause.vinNumber = {
      [Op.like]:'%'+vinNumber+'%'
    };
  }
  if(pinNumber){
    whereClause.pinNumber = {
      [Op.like]:'%'+pinNumber+'%'
    };
  }
  if(verifiedStation){
    whereClause.verifiedStation = {
      [Op.like]:'%'+verifiedStation+'%'
    }
  }
  if(entryStation){
    whereClause.entryStation = {
      [Op.like]:'%'+entryStation+'%'
    }
  }
  if(hall){
    whereClause.hall=hall
  }

  whereClause.isActive = true;

  var reportData;

  if(verifiedStation=="CP8"){
    reportData = await RFIDTagMaster.findAll({
      where:whereClause,
      order: [
      ['updatedAt', 'DESC'],
      ],
      offset:newOffset,
      limit:newLimit
    }); 
  }
  else{
    reportData = await RFIDTagMaster.findAll({
      where:whereClause,
      order: [
      ['id', 'DESC'],
      ],
      offset:newOffset,
      limit:newLimit
    }); 
  }


  if(!reportData){
    res.status(500).send({
      message: "Error while retrieving master data"
    });
  }
  var countArray =[];
  var responseData =[];
  responseData.push(reportData);

  var total = 0;
  total = await RFIDTagMaster.count({ 
    where: whereClause
  });
  
  var totalLocations = {
    totalCount : total
  }
  countArray.push(totalLocations);
  responseData.push(countArray);

  res.status(200).send(responseData);
};


// get count of all rfid master data 
exports.countOfRfidMaster = async (req, res) => {
  var whereClause={};
  var {entryStation,verifiedStation}= req.query;
  if(verifiedStation){
    whereClause.verifiedStation = {
      [Op.like]:'%'+verifiedStation+'%'
    }
  }
  if(entryStation){
    whereClause.entryStation = {
      [Op.like]:'%'+entryStation+'%'
    }
  }
  whereClause.isActive=true;
  var total = await RFIDTagMaster.count({
    where :whereClause
  })

  if(!total){
    return next(HTTPError(500, "Internal error has occurred, while getting count of RFID tag master"))
  }

  var totalCount = {
    totalCount : total 
  }
  res.status(200).send(totalCount);
};

//Delete rfid tag master by Pin number
exports.delete = async (req, res,next) => {
  var { epcId , vinNumber , pinNumber,isActive } = req.body;
  if(req.masterDataList.length == 0){
    return next(HTTPError(500, "Record is not deleted due to invalid pin number"))
  }
  const id = req.masterDataList[0]["id"];

  var transactionTable = await TransactionTable.destroy({
    where: { rfidMasterId: id }
  })
  if(!transactionTable){
    return next(HTTPError(500,"Cannot delete Record with entered pin number"))
  }
  var rfIfMaster =await RFIDTagMaster.destroy({
    where: { id: id }
  })

  if(!rfIfMaster){
    return next(HTTPError(500,"Cannot delete Record with entered pin number"))
  }

  next();    
};


exports.sendDeleteResponse = async (req, res, next) => {
  console.log("responseData")
  res.status(200).send({message: "success"});
};