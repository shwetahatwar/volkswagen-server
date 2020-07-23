'use strict';
module.exports = (sequelize, DataTypes) => {
  const rfidTagMaster = sequelize.define('rfidTagMaster', {
    vinNumber: DataTypes.STRING,
    pinNumber: DataTypes.STRING,
    epcId: DataTypes.STRING,
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