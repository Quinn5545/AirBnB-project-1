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
          url: "https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_architecturaldigest.png,fl_progressive,g_face,h_1080,q_80,w_1920/v1645135325/architecturaldigest_on-the-market-inside-a-23-dollars-million-mega-mansion-surrounded-by-a-lake.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_architecturaldigest.png,fl_progressive,g_face,h_1080,q_80,w_1920/v1645135325/architecturaldigest_on-the-market-inside-a-23-dollars-million-mega-mansion-surrounded-by-a-lake.jpg",
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
