'use strict';
module.exports = (sequelize, DataTypes) => {
  const shiftTable = sequelize.define('shiftTable', {
   name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING
  }, {});
  shiftTable.associate = function(models) {
    // associations can be defined here
  };
  return shiftTable;
};