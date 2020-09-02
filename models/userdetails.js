'use strict';
module.exports = (sequelize, DataTypes) => {
  const userDetails = sequelize.define('userDetails', {
    name: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      unique: true,
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
    isActive: DataTypes.BOOLEAN
  }, {});
  userDetails.associate = function(models) {
    // associations can be defined here
  };
  return userDetails;
};