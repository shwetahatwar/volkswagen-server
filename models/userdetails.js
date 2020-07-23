'use strict';
module.exports = (sequelize, DataTypes) => {
  const userDetails = sequelize.define('userDetails', {
    name: DataTypes.STRING,
    emailId: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  userDetails.associate = function(models) {
    // associations can be defined here
  };
  return userDetails;
};