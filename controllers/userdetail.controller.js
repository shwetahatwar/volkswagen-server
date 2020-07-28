const UserDetails = require('../models').userDetails;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');

//Create use detail
exports.create = async(req,res,next) =>{

  var {name , emailId , mobileNumber } = req.body;
  if (!name || !emailId || !mobileNumber ) {
    return next(HTTPError(400, "Content cannot be empty!"))
  }

  var user = {
  	name: name,
    emailId: emailId,
    isActive: true,
    mobileNumber: mobileNumber
  }

  var userData;
  try {
    userData = await UserDetails.create(user);

    if(!userData){
      return next(HTTPError(500, "User details not created"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the user detail."))
    }
  }

  req.userData = userData.toJSON();
  next();
}

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

// Retrieve user details from the database.
exports.findAll = async (req, res,next) => {
  var { name , emailId , mobileNumber , isActive , offset , limit} = req.query;
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
  .clause('emailId', emailId)
  .clause('isActive', isActive)
  .clause('mobileNumber', mobileNumber).toJSON();
  
  var userData = await UserDetails.findAll({ 
    where: whereClause,
    order: [
    ['createdAt', 'DESC'],
    ],
    offset:newOffset,
    limit:newLimit    
  });

  if (!userData) {
    return next(HTTPError(400, "User details not found"));
  }
  
  req.usersList = userData.map ( el => { return el.get({ plain: true }) } );
  next();
};

// Retrieve user details by id from the database.
exports.findOne = async (req, res, next) => {
  const id = req.params.id;

  var userData = await UserDetails.findByPk(id);
  if (!userData) {
    return next(HTTPError(500, "User details not found"))
  }

  req.usersList = userData;
  next();
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.usersList);
};

//Update User details data
exports.update = async (req, res,next) => {
  const id = req.params.id;
  var { name , emailId , mobileNumber , isActive } = req.body;
  
  updateData = new WhereBuilder()
  .clause('name', name)
  .clause('emailId', emailId)
  .clause('isActive', isActive)
  .clause('mobileNumber', mobileNumber).toJSON();

  try{
    var updatedUserDetail = await UserDetails.update(updateData, {
      where: {
        id: id
      }
    })
    if (!updatedUserDetail) {
      return next(HTTPError(500, "User details not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the user details."))
    }
  }

  req.updatedUserDetail = updatedUserDetail;
  next();    
};

