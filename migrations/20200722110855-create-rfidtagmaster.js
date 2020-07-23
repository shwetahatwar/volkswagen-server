'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rfidTagMasters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vinNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      pinNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      epcId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      entryTimestamp: {
        type: Sequelize.STRING
      },
      verifiedTimestamp: {
        type: Sequelize.STRING
      },
      entryStation: {
        type: Sequelize.STRING
      },
      verifiedStation: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rfidTagMasters');
  }
};