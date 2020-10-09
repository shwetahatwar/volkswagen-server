'use strict';
module.exports = (sequelize, DataTypes) => {
  const shiftTable = sequelize.define('shiftTable', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {});
  shiftTable.associate = function(models) {
    // associations can be defined here
  };
  return shiftTable;
};