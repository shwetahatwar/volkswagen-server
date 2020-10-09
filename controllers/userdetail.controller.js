const UserDetails = require('../models').userDetails;
const Role = require('../models').role;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const WhereBuilder = require('../helpers/WhereBuilder');
var jwt = require('jsonwebtoken');
//Create use detail
exports.create = async(req,res,next) =>{

  var {name , emailId , mobileNumber,hall,password } = req.body;
  if (!name || !emailId || !mobileNumber || !hall ) {
    return next(HTTPError(400, "Content cannot be empty!"))
  }

  var foundRole;
  if (!req.roleList[0]) {
    return next(HTTPError(500, "User not created, inappropriate role"))
  }

  foundRole = req.roleList[0];
  console.log(req.user)
  var user = {
  	name: name,
    password: password,
    emailId: emailId,
    roleId:foundRole["id"],
    hall:hall,
    isActive: true,
    mobileNumber: mobileNumber,
    createdBy:req.user.name,
    updatedBy:req.user.name
  }

  var userData;
  try {
    userData = await UserDetails.create(user);

    if(!userData){
      return next(HTTPError(500, "User details not created"))
    }
  }
  catch (err) {
    console.log("err",err)
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while creating the user detail."))
    }
  }

  req.userData = userData.toJSON();
  next();
};


exports.loginRequired = (req,res,next) => {
  console.log(req.user);
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

// Retrieve user details from the database.
exports.findAll = async (req, res,next) => {
  var { name , emailId , mobileNumber , isActive , offset , limit, hall ,roleId} = req.query;
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
  .clause('hall', hall)
  .clause('roleId', roleId)
  .clause('mobileNumber', mobileNumber).toJSON();
  
  var userData = await UserDetails.findAll({ 
    where: whereClause,
    include: [{
      model: Role
    }
    ],
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

exports.matchPassword = async (req, res, next) => {
  var { password } = req.body;

  if (!password) {
    return next(HTTPError(400, "Password required"))
  }

  console.log(password);
  const passwordMatched = await UserDetails.comparePassword(password, req.signinuser.password);

  if (!passwordMatched) {
    return next(HTTPError(400, "Password mismatched"))
  }

  next();
};

exports.getUser = async (req, res, next) => {
  var { name } = req.body;
  var user = null;

  if (name) {
    user = await UserDetails.scope('withPassword').findOne({
      where: {
        name: name
      },
      include: [{
        model: Role
      }
      ]
    });

    if (!user) {
      return next(HTTPError(404, "User not found"));
    }

    req.signinuser = user.toJSON();
  }

  if (req.signinuser) {
    req.name = req.signinuser.name;
    next();
  } else {
    next(HTTPError(404, "User not found"));
  }
}


exports.sign_in = async (req, res, next) => {
  if (req.signinuser) {
    var user = req.signinuser;
    var jwtToken = jwt.sign({ name: user.name }, "VOLKSWAGENINDIA")
    var response = { 
      token: jwtToken,
      name: user.name,
      userId: user.id,
      hall : user.hall,
      roleId:user["role"]["id"],
      role:user["role"]["name"]
    };

    req.usersList = response;
    req.responseData= response;
    req.user = response;
    if(!response){
      return next(HTTPError(500, "User not found"));
    }
    next();
  }
  else {
    return next(HTTPError(500, "User not found"));
  }
};

//Update User details data
exports.update = async (req, res,next) => {
  const id = req.params.id;
  var { name , emailId , mobileNumber , isActive , hall ,roleId,password} = req.body;
  if (password) {
    password = await UserDetails.encryptPassword(password);
  }
  updateData = new WhereBuilder()
  .clause('name', name)
  .clause('emailId', emailId)
  .clause('updatedBy', req.user.name)
  .clause('isActive', isActive)
  .clause('hall', hall) 
  .clause('password', password)
  .clause('roleId', roleId)
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
    console.log(err)
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

