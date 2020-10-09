'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    isActive: DataTypes.BOOLEAN,
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};