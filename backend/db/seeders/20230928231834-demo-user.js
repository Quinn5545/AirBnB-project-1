"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Bubbles",
          lastName: "McSnortle",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password0"),
          email: "demo@user.io",
        },
        {
          firstName: "John",
          lastName: "Doe",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password1"),
          email: "user1@user.io",
        },
        {
          firstName: "Alice",
          lastName: "Smith",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
          email: "user2@user.io",
        },
        {
          firstName: "Michael",
          lastName: "Johnson",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
          email: "user3@user.io",
        },
        {
          firstName: "Emily",
          lastName: "Brown",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password4"),
          email: "user4@user.io",
        },
        {
          firstName: "David",
          lastName: "Williams",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password5"),
          email: "user5@user.io",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "Demo-lition",
            "FakeUser1",
            "FakeUser2",
            "FakeUser3",
            "FakeUser4",
            "FakeUser5",
          ],
        },
      },
      {}
    );
  },
};
