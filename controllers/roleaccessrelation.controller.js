const db = require("../models");
const RoleAccessRelation = require('../models').roleaccessrelation;
const Op = db.Sequelize.Op;
const Role = require('../models').role;
const Access = require('../models').access;

// Create and Save a new RoleAccessRelation
exports.create =async (req, res,next) => {
  console.log(req.body);
  
  // Validate request
  if (!req.body.roleId) {
    return next(HTTPError(400, "Content can not be empty!"));
    return;
  }

  let responseData=[];
  for(var i=0;i<req.body.accessData.length;i++){
    await Access.findAll({ 
      where: {
        url: req.body.accessData[i]["url"] 
      }
    })
    .then(async data => {
      let accessId =data[0]["dataValues"]["id"]; 
      await RoleAccessRelation.findAll({
        where:{
          roleId: req.body.roleId,
          accessId: data[0]["dataValues"]["id"],
        }
      })
      .then(async data => {
        if(data.length == 0){
          const accessData = {
            roleId: req.body.roleId,
            accessId: accessId,
            status: true,
            createdBy:req.user.name,
            updatedBy:req.user.name
          };

          await RoleAccessRelation.create(accessData)
          .then(data => {
            responseData.push(data);
          })
          .catch(err => {
           return next(HTTPError(500, err["errors"][0]["message"] || "Some error occurred while creating the RoleAccessRelation."));
          });
        }
        else{
          let updateData;
          if(data[0]["dataValues"]["status"]==false){
            updateData={
              status:true
            };
          }
          else{
            updateData={
              status:false
            };
          }
          RoleAccessRelation.update(updateData, {
            where: {
              id:data[0]["dataValues"]["id"]
            }
          })
          .then(num => {
            if (num == 1) {
              console.log("Updated")
            } 
            else {
              console.log("Cannot update RoleAccessRelation with id=",data[0]["dataValues"]["id"])
            }
          })
          .catch(err => {
            console.log("Error updating RoleAccessRelation with id=", data[0]["dataValues"]["id"],err)
          });
        }
      })
      .catch(err => {
        return next(HTTPError(500, err["errors"][0]["message"] || "Some error occurred while creating the RoleAccessRelation."));          
      })
    })
    .catch(err => {
      return next(HTTPError(500, err["errors"][0]["message"] || "Some error occurred while creating the RoleAccessRelation."));
    });
  }
  req.responseData = responseData;
  next();
};

//Get All RoleAccessRelation
exports.getAll = async(req,res,next) =>{

  var { roleId , accessId , status } = req.query;

  var whereClause = new WhereBuilder()
  .clause('roleId', roleId)
  .clause('accessId', accessId)
  .clause('status', status).toJSON();

  var getAllRoleAccessRelations;
  getAllRoleAccessRelations = await RoleAccessRelation.findAll({
    where:whereClause,
    include:[{
      model:Role
    },
    {model:Access}
    ],
    order: [
    ['id', 'DESC'],
    ],
  });
  
  if (!getAllRoleAccessRelations) {
    return next(HTTPError(400, "Role access relations not found"));
  }
  
  req.getAllRoleAccessRelationsList = getAllRoleAccessRelations.map ( el => { return el.get({ plain: true }) } );
  req.responseData = req.getAllRoleAccessRelationsList;
  next();
};

//Update RoleAccessRelation by Id
exports.update = async (req, res,next) => {
  const id = req.params.id;
  var { roleId , accessId , status } = req.body;

  var whereClause = new WhereBuilder()
  .clause('roleId', roleId)
  .clause('accessId', accessId)
  .clause('status', status).toJSON();

  var updateData;

  try {
    updateData = await RoleAccessRelation.update(whereClause,{
      where: req.params
    });

    if (!updateData) {
      return next(HTTPError(500, "Role access relation not updated"))
    }
  }
  catch (err) {
    if(err["errors"]){
      return next(HTTPError(500,err["errors"][0]["message"]))
    }
    else{
      return next(HTTPError(500,"Internal error has occurred, while updating the Role access relation."))
    }
  }

  req.updateData = updateData;
  next();
};

//Get RoleAccessRelation by Id
exports.getById = async(req,res,next) => {
  const id = req.params.id;

  var roleAccessRelation = await RoleAccessRelation.findByPk(id);
  if (!roleAccessRelation) {
    return next(HTTPError(500, "Role access relation not found"))
  }
  req.getAllRoleAccessRelationsList = roleAccessRelation;
  req.responseData = req.getAllRoleAccessRelationsList;
  next();
}

exports.validateAccessUrl = async (req,res,next) =>{
  var {accessUrl , roleId} = req.query;
  var whereClause = {};
  if(accessUrl){
    whereClause.url = accessUrl;
  }
  var accessList = await Access.findAll({ 
    where: whereClause
  });
  
  if(accessList.length !=0){
    let accessId = accessList[0]["dataValues"]["id"];
    var roleAccessRelationWhereClause={};
    roleAccessRelationWhereClause.status=true;
    if(roleId){
      roleAccessRelationWhereClause.roleId = roleId
    }
    roleAccessRelationWhereClause.accessId = accessId;
    roleAccessData = await RoleAccessRelation.findAll({
      where:roleAccessRelationWhereClause
    });
    if(roleAccessData.length != 0){
      req.responseData = roleAccessData;
    }
    else{
      roleAccessData = [];
      req.responseData = roleAccessData;
    }
  }
  else{
    var roleAccessData = [];
    req.responseData = roleAccessData;
  }
  next();
};

exports.sendCreateResponse = async (req, res, next) => {
  res.status(200).send({message: "Success"});
};

exports.sendFindResponse = async (req, res, next) => {
  res.status(200).send(req.responseData);
};