"use strict";

const { ReviewImage } = require("../models");

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
    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "111https://people.com/thmb/BaUYzCEEhQ0PotfgTgCZHTI4cx0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/schitts-creek-home-tout-1-4456f21447984bd49592da039895dc0b.jpg",
        },
        {
          reviewId: 2,
          url: "222https://people.com/thmb/BaUYzCEEhQ0PotfgTgCZHTI4cx0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(749x0:751x2)/schitts-creek-home-tout-1-4456f21447984bd49592da039895dc0b.jpg",
        },
        {
          reviewId: 3,
          url: "333https://media.istockphoto.com/id/504709890/photo/house-burned-in-major-fire.jpg?s=612x612&w=0&k=20&c=kd5htEisBb-Uf809p966Ns8DSijiNApT4cpsnTTCSsA=",
        },
        {
          reviewId: 4,
          url: "444https://media.istockphoto.com/id/504709890/photo/house-burned-in-major-fire.jpg?s=612x612&w=0&k=20&c=kd5htEisBb-Uf809p966Ns8DSijiNApT4cpsnTTCSsA=",
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
    await queryInterface.bulkDelete("ReviewImages");
  },
};
