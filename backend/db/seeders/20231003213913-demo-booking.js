"use strict";

const { Booking } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 1,
          userId: 1,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },
      ],
      {
        validate: true, //make sure this is included for every bulkCreate
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Bookings");
  },
};
