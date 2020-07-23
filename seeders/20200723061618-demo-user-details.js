'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('userDetails', [{
        name: "Sagar K Hangarage",
        isActive: true,
        emailId: "Sagar@briot.in",
        mobileNumber : "8208002780",
        createdAt: new Date(),
        updatedAt: new Date()
        
      }], {});
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('userDetails', null, {});
  }
};
