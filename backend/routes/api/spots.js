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

// GET all spots
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice,
    } = req.query;

    // Parse the page and size values to ensure they are integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    // Calculate the offset based on pageNumber and pageSize
    const offset = (pageNumber - 1) * pageSize;

    const spots = await Spot.findAll({
      include: [
        {
          model: SpotImage,
        },
        {
          model: Review,
        },
      ],
      limit: pageSize,
      offset: offset,
    });

    let spotsList = [];
    spots.forEach((spot) => {
      spotsList.push(spot.toJSON());
    });

    spotsList.forEach((spot) => {
      let totalStars = 0;
      let numReviews = 0;
      spot.SpotImages.forEach((img) => {
        spot.previewImage = img.url;
      });
      spot.Reviews.forEach((rev) => {
        totalStars += rev.stars;
        numReviews++;
      });
      if (numReviews > 0) {
        spot.avgRating = totalStars / numReviews;
      } else {
        spot.avgRating =
          "There are no reviews for this spot yet. Be the first to review!";
      }

      delete spot.Reviews;
      delete spot.SpotImages;
    });
    const response = {
      Spots: spotsList,
      page: pageNumber,
      size: pageSize,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST Create a spot
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt,
      updatedAt,
    } = req.body;

    const existingSpot = await Spot.findOne({
      where: { address, lat, lng, name },
    });

    console.log(existingSpot);

    if (existingSpot) {
      return res.status(400).json({ message: "This Spot already exists" });
    }

    const newSpot = new Spot({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      createdAt,
      updatedAt,
    });
    await newSpot.save();

    res.status(201).json(newSpot);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude is not valid",
        lng: "Longitude is not valid",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day is required",
      },
    });
  }
});

// POST image for a spot
router.post("/:spotId/images", requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    const ownerId = req.user.id;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

    const existingSpotImage = await SpotImage.findOne({
      where: { spotId, url, preview },
    });

    if (existingSpotImage) {
      return res.status(400).json({ message: "This SpotImage already exists" });
    }

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    if (spot.ownerId !== ownerId) {
      return res.status(403).json({
        message: "You are not authorized to add an image to this spot",
      });
    }

    const newImage = new SpotImage({
      spotId,
      url,
      preview,
    });

    await newImage.save();

    const responseImage = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    };

    res.status(200).json(responseImage);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Could not add image" });
  }
});

// GET all spots of the current user
router.get("/current", requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const spots = await Spot.findAll({
      where: { ownerId },
      include: [
        {
          model: SpotImage,
        },
        {
          model: Review,
        },
      ],
    });

    let spotsList = [];
    spots.forEach((spot) => {
      spotsList.push(spot.toJSON());
    });

    spotsList.forEach((spot) => {
      let totalStars = 0;
      let numReviews = 0;
      spot.SpotImages.forEach((img) => {
        spot.previewImage = img.url;
      });
      spot.Reviews.forEach((rev) => {
        totalStars += rev.stars;
        numReviews++;
      });
      if (numReviews > 0) {
        spot.avgRating = totalStars / numReviews;
      } else {
        spot.avgRating =
          "There are no reviews for this spot yet. Be the first to review!";
      }

      delete spot.Reviews;
      delete spot.SpotImages;
    });

    res.json({ spotsList });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Cannot fetch user's spots" });
  }
});

// GET details of a spot by id
router.get("/:spotId", async (req, res) => {
  try {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: Review,
        },
        {
          model: SpotImage,
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          as: "Owner",
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const spotData = spot.toJSON();

    let totalStars = 0;
    let numReviews = 0;

    if (spotData.Reviews && spotData.Reviews.length > 0) {
      spotData.Reviews.forEach((review) => {
        totalStars += review.stars;
        numReviews++;
      });

      // Calculate the average star rating
      if (numReviews > 0) {
        spotData.numReviews = numReviews;
        spotData.avgStarRating = totalStars / numReviews;
      }
    } else {
      spotData.avgStarRating =
        "There are no reviews for this spot yet. Be the first to review!";
      spotData.numReviews = 0;
    }

    delete spotData.Reviews;

    res.json(spotData);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

// PUT edit a spot
router.put("/:spotId", requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    const ownerId = req.user.id;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    if (spot.ownerId !== ownerId) {
      return res.status(403).json({
        message: "You are not authorized to add an image to this spot",
      });
    }

    if (
      !address ||
      !city ||
      !state ||
      !country ||
      isNaN(lat) ||
      isNaN(lng) ||
      !name ||
      !description ||
      isNaN(price)
    ) {
      return res.status(400).json({
        message:
          "Invalid request body. Please provide valid data for address, city, state, country, lat, lng, name, description, and price.",
      });
    }

    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    // TODO verify that this is not needed
    // const updatedSpot = await Spot.findByPk(spotId, {
    //   attributes: [
    //     "id",
    //     "ownerId",
    //     "address",
    //     "city",
    //     "state",
    //     "country",
    //     "lat",
    //     "lng",
    //     "name",
    //     "description",
    //     "price",
    //     "createdAt",
    //     "updatedAt",
    //   ],
    // });
    res.json(spot);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

// DELETE a spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    const ownerId = req.user.id;

    // console.log(req.user.id);

    const deletedSpot = await Spot.findByPk(spotId);

    if (deletedSpot.ownerId !== ownerId) {
      console.log(deletedSpot.ownerId);
      // console.log(ownerId);
      return res.status(403).json({
        message: "You are not authorized to delete to this spot",
      });
    }
    await deletedSpot.destroy();

    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

// GET all reviews by a spots id
router.get("/:spotId/reviews", async (req, res) => {
  try {
    const { spotId } = req.params;

    const reviews = await Review.findByPk(spotId, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    if (!reviews) {
      return res.status(404).json({ message: "Spot not found" });
    }

    res.status(200).json({ Reviews: [reviews] });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

// POST create a review for a spot based on the spots id
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;
  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const existingReview = await Review.findOne({
      where: {
        spotId,
        userId,
      },
    });

    if (!review || stars > 5 || stars < 1) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }

    if (existingReview) {
      return res.status(500).json({
        message: "User already has a review for this spot",
      });
    }
    // const newReview = await Review.findByPk(spotId, {});
    const newReview = await Review.create({
      spotId,
      userId,
      review,
      stars,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

// GET all bookings for a spot based on the spots id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { spotId } = req.params;
    console.log(spotId);

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === ownerId) {
      const bookings = await Booking.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      const formattedBookings = bookings.map((booking) => ({
        User: booking.User,
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }));

      return res.status(200).json({ Bookings: formattedBookings });
    } else {
      const bookings = await Booking.findAll({
        where: { spotId },
        attributes: ["spotId", "startDate", "endDate"],
      });
      res.status(200).json({ bookings });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

//POST create a booking from a spot based on thee spots id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const userId = req.user.id;
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate",
        },
      });
    }

    if (ownerId === spot.ownerId) {
      return res
        .status(403)
        .json("You own this spot, let somebody else book it");
    } else {
      const existingBooking = await Booking.findOne({
        where: {
          spotId,
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
          ],
        },
      });

      if (existingBooking) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }
      const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate,
      });

      res.status(201).json(newBooking);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

module.exports = router;
