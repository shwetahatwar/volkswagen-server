'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('shiftTables', [{
        name: "A",
        startTime: "06:00:00",
        endTime: "14:00:00",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "B",
        startTime: "14:00:00",
        endTime: "22:00:00",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "C",
        startTime: "22:00:00",
        endTime: "06:00:00",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('shiftTables', null, {});
  }
};
