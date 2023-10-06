"use strict";

const { Review } = require("../models");

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
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          review: "it's lit -Travis Scott",
          stars: 5,
        },
        {
          spotId: 1,
          userId: 1,
          review: "it's sorta lit -Travis Scott",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 2,
          review: "it's not lit -(not)Travis Scott",
          stars: 1,
        },
        {
          spotId: 2,
          userId: 2,
          review: "it's decently lit -Travis Scott",
          stars: 3,
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
    await queryInterface.bulkDelete("Reviews");
  },
};
