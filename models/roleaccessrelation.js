'use strict';
module.exports = (sequelize, DataTypes) => {
  const roleaccessrelation = sequelize.define('roleaccessrelation', {
    roleId: DataTypes.INTEGER,
    accessId: DataTypes.INTEGER,
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {});
  roleaccessrelation.associate = function(models) {
    // associations can be defined here
     roleaccessrelation.belongsTo(models.role, {
      foreignKey: 'roleId'
    });
     roleaccessrelation.belongsTo(models.access, {
      foreignKey: 'accessId'
    });
  };
  return roleaccessrelation;
};