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
        // Bookings for Spot 1
        {
          spotId: 1,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 1,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 2
        {
          spotId: 2,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 3
        {
          spotId: 3,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 3,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 4
        {
          spotId: 4,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 4,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 5
        {
          spotId: 5,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 5,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 6
        {
          spotId: 6,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 6,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 7
        {
          spotId: 7,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 7,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },

        // Bookings for Spot 8
        {
          spotId: 8,
          userId: 1,
          startDate: "2023-10-01",
          endDate: "2023-10-11",
        },
        {
          spotId: 8,
          userId: 2,
          startDate: "2023-10-12",
          endDate: "2023-10-22",
        },
      ],
      {
        validate: true, // Make sure this is included for every bulkCreate
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
