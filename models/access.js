'use strict';
module.exports = (sequelize, DataTypes) => {
  const access = sequelize.define('access', {
    url: DataTypes.STRING,
    httpMethod: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  access.associate = function(models) {
    // associations can be defined here
  };
  return access;
};