const express = require("express");
const { Op } = require("sequelize");
// const bcrypt = require("bcryptjs");
const { requireAuth } = require("../../utils/auth.js");

const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");

const router = express.Router();

// DELETE an image for a spot
router.delete("/:spotImageId", requireAuth, async (req, res) => {
  try {
    const { spotImageId } = req.params;
    const userId = req.user.id;

    const image = await SpotImage.findByPk(spotImageId);

    if (!image) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    const spot = await Spot.findByPk(image.spotId);

    console.log(userId);
    console.log(spot.ownerId);

    if (!spot || spot.ownerId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this image" });
    }
    await image.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
