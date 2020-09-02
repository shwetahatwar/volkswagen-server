'use strict';
module.exports = (sequelize, DataTypes) => {
  const deviceTable = sequelize.define('deviceTable', {
   deviceId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    deviceIp: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    station: DataTypes.STRING,
    connectionStatus: DataTypes.STRING,
    timestamp: DataTypes.STRING
  }, {});
  deviceTable.associate = function(models) {
    // associations can be defined here
  };
  return deviceTable;
};