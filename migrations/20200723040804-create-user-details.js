'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('userDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      emailId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      mobileNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      hall: {
        type: Sequelize.STRING,
        allowNull: false
      },
      roleId:{
        type: DataTypes.INTEGER,
        allowNull:false
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
    return queryInterface.dropTable('userDetails');
  }
};