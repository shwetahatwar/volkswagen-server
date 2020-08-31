'use strict';
module.exports = (sequelize, DataTypes) => {
  const rfidTagMaster = sequelize.define('rfidTagMaster', {
    vinNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    epcId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    pinNumber: DataTypes.STRING,
    entryTimestamp: DataTypes.STRING,
    verifiedTimestamp: DataTypes.STRING,
    entryStation: DataTypes.STRING,
    verifiedStation: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  rfidTagMaster.associate = function(models) {
    // associations can be defined here
  };
  return rfidTagMaster;
};