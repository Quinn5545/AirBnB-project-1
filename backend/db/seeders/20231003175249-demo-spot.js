"use strict";
const { Spot } = require("../models");

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
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "1 Fake lane",
          city: "Palm Desert",
          state: "California",
          country: "USA",
          lat: 1.1,
          lng: 1.1,
          name: "1 house",
          description: "1 house is nice",
          price: 100.1,
        },
        {
          ownerId: 2,
          address: "2 Fake lane",
          city: "Palm Desert",
          state: "California",
          country: "USA",
          lat: 2.2,
          lng: 2.2,
          name: "2 house",
          description: "2 house is nice",
          price: 100.2,
        },
        {
          ownerId: 3,
          address: "3 Fake lane",
          city: "Palm Desert",
          state: "California",
          country: "USA",
          lat: 3.3,
          lng: 3.3,
          name: "3 house",
          description: "3 house is nice",
          price: 100.3,
        },
        {
          ownerId: 4,
          address: "4 Fake lane",
          city: "Palm Desert",
          state: "California",
          country: "USA",
          lat: 4.4,
          lng: 4.4,
          name: "4 house",
          description: "4 house is nice",
          price: 100.4,
        },
      ],
      {
        validate: true, //make sure this is included for every bulkCreate
      }
    );
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // harder version
    // await Spot.destroy({
    //   where: {
    //     id: {
    //       [Op.in]: [1, 2],
    //     },
    //   },
    // });
    await queryInterface.bulkDelete("Spots"); // table name //much easier version
  },
};
