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
          url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
        },
        {
          reviewId: 2,
          url: "https://media.istockphoto.com/id/1333804787/photo/modern-white-interior-design-with-fireplace-and-beautiful-backyard-view.jpg?s=612x612&w=0&k=20&c=y-iu57-SElFVq6-nW0ZvQHQcDnzL9Stq4v6m88jT-sQ=",
        },
        {
          reviewId: 3,
          url: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?cs=srgb&dl=pexels-vecislavas-popa-1571459.jpg&fm=jpg",
        },
        {
          reviewId: 4,
          url: "https://media.istockphoto.com/id/1142747548/photo/modern-house-interior-design.jpg?s=1024x1024&w=is&k=20&c=k6lYPN64-dDF2gZJl2Hvxq12DaT_1b1r-nR_asEUCP0=",
        },
        {
          reviewId: 5,
          url: "https://images.unsplash.com/photo-1613082294483-fec382d8367e?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
          reviewId: 6,
          url: "https://media.istockphoto.com/id/1276567523/photo/wonderful-open-floorplan-in-new-luxury-home-with-black-trim-windows.jpg?s=612x612&w=0&k=20&c=d470_B3BnMBD-7IyceOzwVFAWmXcD0DgSbeT5jeJBpU=",
        },
        {
          reviewId: 7,
          url: "https://media.istockphoto.com/id/1326994520/photo/we-all-deserve-a-fresh-break-from-the-city.webp?b=1&s=170667a&w=0&k=20&c=S7T1RDGbTjnHTbr20d2KOns1mBBRqFAAZAuJijy02VY=",
        },
        {
          reviewId: 8,
          url: "https://i.pinimg.com/originals/ec/94/a0/ec94a08704d1fbe418c1c1147bbddcac.jpg",
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
    await queryInterface.bulkDelete("ReviewImages");
  },
};
