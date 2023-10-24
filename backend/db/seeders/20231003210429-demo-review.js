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
          review:
            "I had an amazing time at this luxurious villa. The private pool was a highlight, and the views were breathtaking!",
          stars: 5,
        },
        {
          spotId: 1,
          userId: 2,
          review:
            "The villa was nice, but it was a bit pricey for my taste. Still, a good experience overall.",
          stars: 4,
        },
        {
          spotId: 2,
          userId: 1,
          review:
            "The golf resort getaway was a dream come true. I loved the stunning mountain views and the golfing experience.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 2,
          review:
            "I didn't enjoy my stay at the golf resort. The mountain views were nice, but the service could have been better.",
          stars: 2,
        },
        {
          spotId: 3,
          userId: 1,
          review:
            "The mid-century modern home in Palm Springs was a blast from the past. The architecture and interior were incredible!",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 2,
          review:
            "The mid-century modern home was a unique experience, but it wasn't my style. Still, it was interesting to stay there.",
          stars: 3,
        },
        {
          spotId: 4,
          userId: 1,
          review:
            "I had a wonderful time at the desert oasis retreat. The serenity of Indian Wells was truly relaxing, and the property was well-maintained.",
          stars: 5,
        },
        {
          spotId: 4,
          userId: 2,
          review:
            "The desert oasis retreat was decent, but I expected more for the price. The property was nice, but it didn't fully meet my expectations.",
          stars: 4,
        },
        {
          spotId: 5,
          userId: 1,
          review:
            "I thoroughly enjoyed my stay at the mountain-view villa in Rancho Mirage. The views were stunning, and the villa was comfortable.",
          stars: 5,
        },
        {
          spotId: 5,
          userId: 2,
          review:
            "The mountain-view villa was a great choice. The location was convenient, and the amenities were fantastic.",
          stars: 4,
        },
        {
          spotId: 6,
          userId: 1,
          review:
            "The tropical paradise in Cathedral City was a fantastic escape. The lush garden and pool made it a memorable trip.",
          stars: 5,
        },
        {
          spotId: 6,
          userId: 2,
          review:
            "The tropical paradise was a lovely experience. The garden was a highlight, but it could use some minor improvements.",
          stars: 4,
        },
        {
          spotId: 7,
          userId: 1,
          review:
            "The sunset retreat in Coachella was breathtaking. I loved watching the stunning sunsets from the property.",
          stars: 5,
        },
        {
          spotId: 7,
          userId: 2,
          review:
            "The sunset retreat provided a unique experience, and the sunsets were truly amazing. A great place for relaxation.",
          stars: 5,
        },
        {
          spotId: 8,
          userId: 1,
          review:
            "I had a relaxing time at the hot springs getaway in Desert Hot Springs. The therapeutic pools were fantastic.",
          stars: 4,
        },
        {
          spotId: 8,
          userId: 2,
          review:
            "The hot springs getaway was a peaceful escape. The pools were relaxing, but some maintenance was needed.",
          stars: 4,
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
    await queryInterface.bulkDelete("Reviews");
  },
};
