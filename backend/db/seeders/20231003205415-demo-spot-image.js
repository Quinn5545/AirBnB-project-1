"use strict";

const { SpotImage } = require("../models");

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
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://robbreport.com/wp-content/uploads/2023/07/DJI_0661.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://robbreport.com/wp-content/uploads/2023/07/DJI_0661.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://thumbor.bigedition.com/img/Z-vEdZNmHPOuRj_0VQVcTunprAE=/874x404/filters:format(webp):quality(80)/granite-web-prod/c5/31/c531a5417a4c406387e09348dba5a923.jpeg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://thumbor.bigedition.com/img/Z-vEdZNmHPOuRj_0VQVcTunprAE=/874x404/filters:format(webp):quality(80)/granite-web-prod/c5/31/c531a5417a4c406387e09348dba5a923.jpeg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://www.jamesedition.com/stories/wp-content/uploads/2020/12/1_Israel.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://www.jamesedition.com/stories/wp-content/uploads/2020/12/1_Israel.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://images.pexels.com/photos/3554424/pexels-photo-3554424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://images.pexels.com/photos/3554424/pexels-photo-3554424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://images.pexels.com/photos/1560065/pexels-photo-1560065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://images.pexels.com/photos/1560065/pexels-photo-1560065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://images.pexels.com/photos/2980955/pexels-photo-2980955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://images.pexels.com/photos/2980955/pexels-photo-2980955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          preview: true,
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
    await queryInterface.bulkDelete("SpotImages");
  },
};
