'use strict';
module.exports = (sequelize, DataTypes) => {
  const deviceTable = sequelize.define('deviceTable', {
    deviceId: DataTypes.STRING,
    deviceIp: DataTypes.STRING,
    station: DataTypes.STRING,
    connectionStatus: DataTypes.STRING,
    timestamp: DataTypes.STRING
  }, {});
  deviceTable.associate = function(models) {
    // associations can be defined here
  };
  return deviceTable;
};