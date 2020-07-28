const ShiftTable = require('../models').shiftTable;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');

//create Shift table
exports.create = async(req,res,next) =>{

  var {startTime , endTime , name } = req.body;
  if (!startTime || !endTime || !name ) {
    return next(HTTPError(400, "Content cannot be empty!"))
  }

  var shift = {
  	startTime: startTime,
    endTime: endTime,
    name: name
  }

  var shiftData;
  try {
    shiftData = await ShiftTable.create(shift);

    if(!shiftData){
      return next(HTTPError(500, "Shift data not created"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the shift."))
    }
  }

  req.shiftData = shiftData.toJSON();
  next();
}

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

// Retrieve shifts from the database.
exports.findAll = async (req, res,next) => {
  var { name , startTime , endTime , offset , limit} = req.query;
  var newOffset = 0;
  var newLimit = 100;

  if(offset){
    newOffset = parseInt(offset)
  }

  if(limit){
    newLimit = parseInt(limit)
  }

  var whereClause = new WhereBuilder()
  .clause('name', name)
  .clause('startTime', startTime)
  .clause('endTime', endTime).toJSON();
  
  var shiftData = await ShiftTable.findAll({ 
    where: whereClause,
    order: [
    ['createdAt', 'DESC'],
    ],
    offset:newOffset,
    limit:newLimit    
  });

  if (!shiftData) {
    return next(HTTPError(400, "Shift not found"));
  }
  
  req.shiftDataList = shiftData.map ( el => { return el.get({ plain: true }) } );
  next();
};

// Retrieve shift by id from the database.
exports.findOne = async (req, res, next) => {
  const id = req.params.id;

  var shiftData = await ShiftTable.findByPk(id);
  if (!shiftData) {
    return next(HTTPError(500, "Shift not found"))
  }

  req.shiftDataList = shiftData;
  next();
};

// Retrieve shift by name from the database.
exports.findByName = async (req, res, next) => {
  var name = req.query.shift;
  var shiftData = [];
  if(name){
    name = name.toUpperCase();
    shiftData = await ShiftTable.findOne({
      where:{
      name : name
    }
    });
    if (!shiftData) {
      return next(HTTPError(500, "Shift not found"))
    }
    req.shiftNameData = shiftData.toJSON();
  }
  
  next();
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.shiftDataList);
};

//Update shift data
exports.update = async (req, res,next) => {
  const id = req.params.id;
  var { name , startTime , endTime } = req.body;
  
  updateData = new WhereBuilder()
  .clause('name', name)
  .clause('startTime', startTime)
  .clause('endTime', endTime).toJSON();

  try{
    var updatedShiftData = await ShiftTable.update(updateData, {
      where: {
        id: id
      }
    })
    if (!updatedShiftData) {
      return next(HTTPError(500, "Shift not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the shift."))
    }
  }

  req.updatedShiftData = updatedShiftData;
  next();    
};

