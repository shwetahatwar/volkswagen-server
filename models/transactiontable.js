'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactionTable = sequelize.define('transactionTable', {
    rfidMasterId: DataTypes.INTEGER,
    timestamp: DataTypes.STRING,
    transactionType: DataTypes.STRING,
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {});
  transactionTable.associate = function(models) {
    // associations can be defined here
    transactionTable.belongsTo(models.rfidTagMaster, {
      foreignKey: 'rfidMasterId'
    });
  };
  return transactionTable;
};