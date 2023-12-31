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

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(pageSize) ||
      pageNumber < 1 ||
      pageNumber > 10 || // Maximum page number: 10
      pageSize < 1 ||
      pageSize > 20 || // Maximum page size: 20
      minPrice < 1 ||
      maxPrice < 1 ||
      minLat < -180 ||
      maxLat > 180 ||
      minLng < -180 ||
      maxLng > 180
    ) {
      return res.status(400).json({
        message: "Bad Request", // (or "Validation error" if generated by Sequelize),
        errors: {
          page: "Page must be greater than or equal to 1",
          size: "Size must be greater than or equal to 1",
          maxLat: "Maximum latitude is invalid",
          minLat: "Minimum latitude is invalid",
          minLng: "Maximum longitude is invalid",
          maxLng: "Minimum longitude is invalid",
          minPrice: "Minimum price must be greater than or equal to 0",
          maxPrice: "Maximum price must be greater than or equal to 0",
        },
      });
    }

    const filterOptions = {};

    if (minLat && maxLat) {
      filterOptions.lat = {
        [Op.between]: [minLat, maxLat],
      };
    }

    if (minLng && maxLng) {
      filterOptions.lng = {
        [Op.between]: [minLng, maxLng],
      };
    }

    if (minPrice && maxPrice) {
      filterOptions.price = {
        [Op.between]: [minPrice, maxPrice],
      };
    }

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
      offset: (pageNumber - 1) * pageSize,
      where: filterOptions,
    });

    let spotsList = [];
    spots.forEach((spot) => {
      spotsList.push(spot.toJSON());
    });

    spotsList.forEach((spot) => {
      let totalStars = 0;
      let numReviews = 0;
      spot.SpotImages.forEach((img) => {
        if (img.preview) {
          spot.previewImage = img.url;
        }
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

    //todo maybe include later. not important rn
    // if (!response.Spots.length) {
    //   return res.status(404).json({ message: "spot not found" });
    // }

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
      // ownerId,
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

    /* not necessary right now to check for dupes

    const existingSpot = await Spot.findOne({
      where: { address, lat, lng, name },
    });

    console.log(existingSpot);

    if (existingSpot) {
      return res.status(400).json({ message: "This Spot already exists" });
    }


     */

    const newSpot = await Spot.create({
      ownerId: req.user.id,
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
    // await newSpot.save(); //not necessary

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
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== ownerId) {
      return res.status(403).json({
        message: "You are not authorized to add an image to this spot",
      });
    }

    const newImage = await SpotImage.create({
      spotId: spotId,
      url,
      preview,
    });

    // await newImage.save();

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
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== ownerId) {
      return res.status(403).json({
        message: "You are not authorized to add an image to this spot",
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

    res.json(spot);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
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

// DELETE a spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  try {
    const { spotId } = req.params;
    // const ownerId = req.user.id;

    // console.log(req.user.id);

    const deletedSpot = await Spot.findByPk(spotId);

    if (deletedSpot.ownerId != req.user.id) {
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

    const reviews = await Review.findAll({
      where: { spotId },
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

    if (!reviews.length) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
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

//POST create a booking from a spot based on the spots id

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const userId = req.user.id;
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const newStartDate = new Date(startDate).getTime();
    const newEndDate = new Date(endDate).getTime();

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (newStartDate >= newEndDate) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot be on or before startDate",
        },
      });
    }

    if (ownerId === spot.ownerId) {
      return res.status(403).json({
        message: "You are not authorized to book this spot because you own it",
      });
    }

    const currBookings = await Booking.findAll({
      where: {
        spotId: spotId,
      },
    });

    const errorsObj = {};

    currBookings.forEach((bookings) => {
      //setup for comp
      const bookingStartDate = new Date(
        bookings.dataValues.startDate
      ).getTime();
      const bookingEndDate = new Date(bookings.dataValues.endDate).getTime();

      console.log(bookings.dataValues);

      // start date is during a bookings
      if (newStartDate >= bookingStartDate && newStartDate <= bookingEndDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
      }

      // end date is during a bookings
      if (newEndDate >= bookingStartDate && newEndDate <= bookingEndDate) {
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (newStartDate < bookingStartDate && newEndDate > bookingEndDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (newStartDate === bookingStartDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
      }

      if (newStartDate === bookingEndDate) {
        errorsObj.startDate = "Start date conflicts with an existing bookings";
      }

      if (newEndDate === bookingEndDate) {
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (newEndDate === bookingStartDate) {
        errorsObj.endDate = "End date conflicts with an existing bookings";
      }

      if (errorsObj.startDate || errorsObj.endDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: errorsObj,
        });
      }
    });

    if (errorsObj.startDate || errorsObj.endDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: errorsObj,
      });
    } else {
      const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate,
      });

      res.status(201).json(newBooking);
    }

    return null;
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Can't find the spot specified" });
  }
});

module.exports = router;
