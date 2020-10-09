'use strict';
module.exports = (sequelize, DataTypes) => {
  const rfidTagMaster = sequelize.define('rfidTagMaster', {
    pinNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
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
    entryTimestamp: DataTypes.STRING,
    verifiedTimestamp: DataTypes.STRING,
    entryStation: DataTypes.STRING,
    verifiedStation: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    entryShift: DataTypes.STRING,
    verifiyingShift: DataTypes.STRING,
    hall: DataTypes.STRING,
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {});
  rfidTagMaster.associate = function(models) {
    // associations can be defined here
  };
  return rfidTagMaster;
};