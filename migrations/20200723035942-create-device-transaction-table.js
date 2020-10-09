'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deviceTransactionTables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      station: {
        type: Sequelize.STRING,
        allowNull: false
      },
      connectionStatus: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable('deviceTransactionTables');
  }
};