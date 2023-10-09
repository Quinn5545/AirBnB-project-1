"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "Owner",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 256],
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 256],
          isOnlyLettersAndSpaces(value) {
            if (!/^[A-Za-z\s]+$/.test(value)) {
              throw new Error("City should only contain letters and spaces.");
            }
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 256],
          isOnlyLettersAndSpaces(value) {
            if (!/^[A-Za-z\s]+$/.test(value)) {
              throw new Error("City should only contain letters and spaces.");
            }
          },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 256],
          isOnlyLettersAndSpaces(value) {
            if (!/^[A-Za-z\s]+$/.test(value)) {
              throw new Error("City should only contain letters and spaces.");
            }
          },
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true,
          min: -180,
          max: 180,
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true,
          min: -180,
          max: 180,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 256],
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
