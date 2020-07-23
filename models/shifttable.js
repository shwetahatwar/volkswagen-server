'use strict';
module.exports = (sequelize, DataTypes) => {
  const shiftTable = sequelize.define('shiftTable', {
    name: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING
  }, {});
  shiftTable.associate = function(models) {
    // associations can be defined here
  };
  return shiftTable;
};