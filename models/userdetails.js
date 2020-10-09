'use strict';
var bcrypt = require('bcrypt-nodejs');
var bbPromise = require('bluebird');
module.exports = (sequelize, DataTypes) => {
  const userDetails = sequelize.define('userDetails', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    mobileNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    hall:{
      type: DataTypes.STRING,
      allowNull: false
    },
    roleId:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    isActive: DataTypes.BOOLEAN,
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {hooks: {
      beforeUpdate: function(user) {
        return new bbPromise(function(resolve, reject) {
          bcrypt.genSalt(5, function(err, salt) {
            if (err) { reject(err); return; }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
              if (err) { reject(err); return; }
              user.password = hash;
              resolve(user);
            });
          });
        });
      },
      beforeCreate: function(user) {
        return new bbPromise(function(resolve, reject) {
          bcrypt.genSalt(5, function(err, salt) {
            if (err) { reject(err); return; }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
              if (err) { reject(err); return; }
              user.password = hash;
              resolve(user);
            });
          });
        });
      }
    },
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: {
        attributes: { },
      }
    }
  });
  userDetails.associate = function(models) {
    // associations can be defined here
    userDetails.belongsTo(models.role, {
      foreignKey: 'roleId'
    });
  };
    userDetails.comparePassword = function(reqpass, password) {
    return new bbPromise((resolve, reject) => {
      bcrypt.compare(reqpass, password, function(err, res) {
        if(err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    })
  };

  userDetails.encryptPassword = function (password) {
    return new bbPromise(function(resolve, reject) {
      bcrypt.genSalt(5, function(err, salt) {
        if (err) { reject(err); return; }

        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) { reject(err); return; }
          password = hash;
          resolve(password);
        });
      });
    });
  }
  return userDetails;
};