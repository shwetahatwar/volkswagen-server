'use strict';
module.exports = (sequelize, DataTypes) => {
  const deviceTransactionTable = sequelize.define('deviceTransactionTable', {
    deviceId: DataTypes.STRING,
    connectionStatus: DataTypes.STRING,
    station: DataTypes.STRING,
    timestamp: DataTypes.STRING,
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {});
  deviceTransactionTable.associate = function(models) {
    // associations can be defined here
  };
  return deviceTransactionTable;
};