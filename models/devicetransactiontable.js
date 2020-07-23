'use strict';
module.exports = (sequelize, DataTypes) => {
  const deviceTransactionTable = sequelize.define('deviceTransactionTable', {
    deviceId: DataTypes.STRING,
    connectionStatus: DataTypes.STRING,
    timestamp: DataTypes.STRING
  }, {});
  deviceTransactionTable.associate = function(models) {
    // associations can be defined here
  };
  return deviceTransactionTable;
};