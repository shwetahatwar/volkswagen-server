const db = require("../models");
const Material = db.materials;
const User = require('../models').userDetails;
const Role = require('../models').role;
const Access = require('../models').access;
const RoleAccessRelation = require('../models').roleaccessrelation;
var XLSX = require('xlsx'),
xls_utils = XLSX.utils;

exports.uploadUserMaster = async (req,res) =>{
  const role = {
    name: "Admin",
    isActive:true,
    createdBy:"admin",
    updatedBy:"admin"
  };

  var roleData;
  await Role.create(role)
  .then(async data => {
    roleData = data["dataValues"]["id"];
    const user = {
      name: "admin",
      password: "briot",
      emailId: "sagar@briot.in",
      roleId:roleData,
      hall:"A",
      isActive: true,
      mobileNumber: "8208002780",
      createdBy:"admin",
      updatedBy:"admin"
    };

      // Save User in the database
      await User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || "Some error occurred while creating the User."
        });
      });

    })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating the role."
    });
  });

  var filepath1 = './documents/templates/bulk-upload/RoleAccess.xlsx';
  var workbook1 = XLSX.readFile(filepath1);
  var sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
  var num_rows1 = xls_utils.decode_range(sheet1['!ref']).e.r;
  var json1 = [];
  try{
    for(var i = 1, l = num_rows1; i <= l; i++){
      var accessUrl = xls_utils.encode_cell({c:0, r:i});

      var accessUrlValue = sheet1[accessUrl];
      var accessUrlResult = accessUrlValue['v'];

      const accessData = {
        url: accessUrlResult,
        httpMethod:"CRUD",
        status:true,
        createdBy:"admin",
        updatedBy:"admin"
      };

      await Access.create(accessData)
      .then(async data => {
        const roleAccessData = {
          roleId: roleData,
          accessId: data["dataValues"]["id"],
          status: true,
          createdBy:"admin",
          updatedBy:"admin"
        };

        await RoleAccessRelation.create(roleAccessData)
        .then(data => {
          console.log("RoleAccessRelation created",data);
        })
        .catch(err => {
          res.status(500).send({
            message:
            err["errors"][0]["message"] || "Some error occurred while creating the RoleAccessRelation."
          });
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || "Some error occurred while creating the role."
        });
      });
    }

    const role = {
      name: "CP6",
      isActive:true,
      createdBy:"admin",
      updatedBy:"admin"
    };
    await Role.create(role);

    role = {
      name: "CP8",
      isActive:true,
      createdBy:"admin",
      updatedBy:"admin"
    };
    await Role.create(role);
    res.send("Data uploaded");
  }
  catch{
    console.log("In Error");
  }

  return;
}