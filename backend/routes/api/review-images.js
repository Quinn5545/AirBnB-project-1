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

//DELETE an image for a review
router.delete("/:reviewImageId", requireAuth, async (req, res) => {
  try {
    const { reviewImageId } = req.params;
    const userId = req.user.id;

    const image = await ReviewImage.findByPk(reviewImageId);
    // console.log(image);

    if (!image) {
      return res
        .status(404)
        .json({ message: "Review Image couldn't be found" });
    }

    const review = await Review.findByPk(image.reviewId);

    // console.log(review.userId);
    // console.log(userId);

    if (!review || review.userId !== userId) {
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
