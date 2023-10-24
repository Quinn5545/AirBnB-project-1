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
          address: "1234 Desert Palm Drive",
          city: "Palm Desert",
          state: "California",
          country: "USA",
          lat: 33.722596,
          lng: -116.37875,
          name: "Luxurious Villa",
          description: "Stay in a luxurious villa with a private pool.",
          price: 200.0,
        },
        {
          ownerId: 2,
          address: "567 Oasis Street",
          city: "La Quinta",
          state: "California",
          country: "USA",
          lat: 33.667063,
          lng: -116.293988,
          name: "Golf Resort Getaway",
          description: "Relax at a golf resort with stunning mountain views.",
          price: 150.0,
        },
        {
          ownerId: 3,
          address: "789 Palm Springs Blvd",
          city: "Palm Springs",
          state: "California",
          country: "USA",
          lat: 33.830296,
          lng: -116.54529,
          name: "Mid-Century Modern Home",
          description:
            "Experience a classic Palm Springs mid-century modern home.",
          price: 175.0,
        },
        {
          ownerId: 4,
          address: "101 Desert Rose Lane",
          city: "Indian Wells",
          state: "California",
          country: "USA",
          lat: 33.714181,
          lng: -116.312274,
          name: "Desert Oasis Retreat",
          description: "A serene retreat in the heart of Indian Wells.",
          price: 220.0,
        },
        {
          ownerId: 1,
          address: "2345 Canyon View Road",
          city: "Rancho Mirage",
          state: "California",
          country: "USA",
          lat: 33.765399,
          lng: -116.441134,
          name: "Mountain-View Villa",
          description: "Enjoy breathtaking mountain views in this villa.",
          price: 190.0,
        },
        {
          ownerId: 2,
          address: "678 Paradise Place",
          city: "Cathedral City",
          state: "California",
          country: "USA",
          lat: 33.823647,
          lng: -116.470594,
          name: "Tropical Paradise",
          description: "A tropical paradise with a lush garden and pool.",
          price: 160.0,
        },
        {
          ownerId: 3,
          address: "4321 Sunset Drive",
          city: "Coachella",
          state: "California",
          country: "USA",
          lat: 33.678675,
          lng: -116.17557,
          name: "Sunset Retreat",
          description: "Watch stunning sunsets from your private retreat.",
          price: 175.0,
        },
        {
          ownerId: 4,
          address: "876 Desert Hills Road",
          city: "Desert Hot Springs",
          state: "California",
          country: "USA",
          lat: 33.959308,
          lng: -116.510563,
          name: "Hot Springs Getaway",
          description: "Relax in a hot springs getaway with therapeutic pools.",
          price: 210.0,
        },
      ],
      {
        validate: true, // Make sure this is included for every bulkCreate
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
