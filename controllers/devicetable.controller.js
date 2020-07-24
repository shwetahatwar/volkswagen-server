const DeviceTable = require('../models').deviceTable;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');
const deviceTransactionFunction = require('../functions/createDeviceTransaction');

//create Device table
exports.create = async(req,res,next) =>{

  var {deviceId , deviceIp , connectionStatus , station } = req.body;
  if (!deviceId || !deviceIp || !connectionStatus ) {
    return next(HTTPError(400, "Content cannot be empty!"))
  }

  var device = {
  	deviceId: deviceId,
    deviceIp: deviceIp,
    station: station,
    connectionStatus: connectionStatus,
    timestamp: Date.now()
  }

  var deviceData;
  try {
    deviceData = await DeviceTable.create(device);

    if(!deviceData){
      return next(HTTPError(500, "Device data not created"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the device data."))
    }
  }

  req.deviceData = deviceData.toJSON();
  next();
}

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

// Retrieve device from the database.
exports.findAll = async (req, res,next) => {
  var { deviceId , deviceIp , station , connectionStatus , offset , limit} = req.query;
  var newOffset = 0;
  var newLimit = 100;

  if(offset){
    newOffset = parseInt(offset)
  }

  if(limit){
    newLimit = parseInt(limit)
  }

  var whereClause = new WhereBuilder()
  .clause('deviceId', deviceId)
  .clause('deviceIp', deviceIp)
  .clause('station', station)
  .clause('connectionStatus', connectionStatus).toJSON();
  
  var deviceData = await DeviceTable.findAll({ 
    where: whereClause,
    order: [
    ['createdAt', 'DESC'],
    ],
    offset:newOffset,
    limit:newLimit    
  });

  if (!deviceData) {
    return next(HTTPError(400, "Device not found"));
  }
  
  req.deviceDataList = deviceData.map ( el => { return el.get({ plain: true }) } );
  next();
};

// Retrieve device by id from the database.
exports.findOne = async (req, res, next) => {
  const id = req.params.id;

  var deviceData = await DeviceTable.findByPk(id);
  if (!deviceData) {
    return next(HTTPError(500, "Device not found"))
  }

  req.deviceDataList = deviceData;
  next();
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.deviceDataList);
};

//Update device data
exports.update = async (req, res,next) => {
  const id = req.params.id;
  var { deviceId , deviceIp , connectionStatus } = req.body;
  
  whereClause = new WhereBuilder()
  .clause('deviceId', deviceId)
  .clause('deviceIp', deviceIp)
  .clause('station', station)
  .clause('connectionStatus', connectionStatus).toJSON();

  try{
    var updatedDeviceData = await DeviceTable.update(whereClause, {
      where: {
        id: id
      }
    })
    if (!updatedDeviceData) {
      return next(HTTPError(500, "Device not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the device."))
    }
  }

  req.updatedDeviceData = updatedDeviceData;
  next();    
};


