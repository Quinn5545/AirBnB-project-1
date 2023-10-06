const express = require("express");
// const { Op } = require("sequelize");
// const bcrypt = require("bcryptjs");
const { requireAuth } = require("../../utils/auth.js");

const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
} = require("../../db/models");

const router = express.Router();

// GET all reviews of the current user
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
          include: [
            {
              model: SpotImage,
              attributes: ["url"],
            },
          ],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
      attributes: [
        "id",
        "userId",
        "spotId",
        "review",
        "stars",
        "createdAt",
        "updatedAt",
      ],
    });

    res.json({ Review: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST create an image for a review
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const ownerId = req.user.id;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    // console.log(ownerId);
    // console.log(review.id);
    if (ownerId !== review.id) {
      return res.status(403).json({
        message: "You are not authorized to add images to this place",
      });
    }

    const existingImagesCount = await ReviewImage.count({
      where: { reviewId },
    });

    const maxImagesAllowed = 10;

    if (existingImagesCount > maxImagesAllowed) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }

    const newReviewImage = await ReviewImage.create({
      reviewId,
      url,
    });

    return res.status(200).json({
      id: newReviewImage.id,
      url: newReviewImage.url,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the review specified" });
  }
});

// PUT edit a review
router.put("/:reviewId", requireAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const ownerId = req.user.id;
    const { review, stars } = req.body;

    const oldReview = await Review.findByPk(reviewId);

    if (!oldReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (ownerId !== oldReview.userId) {
      return res.status(403).json({
        message: "You are not authorized to add images to this place",
      });
    }

    if (!review || stars > 5 || stars < 1) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }

    await oldReview.update({
      review,
      stars,
    });

    res.status(200).json(oldReview);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the review specified" });
  }
});

// DELETE a review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const ownerId = req.user.id;

    const deletedReview = await Review.findByPk(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    // console.log(ownerId);
    // console.log(deletedReview.userId);

    if (ownerId !== deletedReview.userId) {
      return res.status(403).json({
        message: "You are not authorized to add images to this place",
      });
    }

    await deletedReview.destroy();

    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "Review couldn't be found",
    });
  }
});

module.exports = router;
