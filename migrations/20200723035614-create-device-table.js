'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deviceTables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      station: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      deviceIp: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      connectionStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdBy:{
        type:DataTypes.STRING,
        allowNull:true
      },
      updatedBy:{
        type:DataTypes.STRING,
        allowNull:true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deviceTables');
  }
};