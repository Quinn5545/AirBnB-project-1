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

// GET all bookings from current user
router.get("/current", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Spot,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: SpotImage,
              attributes: ["url"],
            },
          ],
        },
      ],
    });

    const bookingsList = bookings.map((book) => {
      const spot = book.Spot.toJSON();
      // If there are SpotImages, set the previewImage URL to the first one
      if (spot.SpotImages && spot.SpotImages.length > 0) {
        spot.url = spot.SpotImages[0].url;
      } else {
        spot.url = null; // Handle the case where there are no images
      }
      // Remove the SpotImages property
      delete spot.SpotImages;
      return {
        ...book.toJSON(),
        Spot: spot,
      };
    });

    res.status(200).json({ Bookings: bookingsList });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Cannot fetch user's bookings" });
  }
});

// PUT edit a booking
router.put("/:bookingId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId);

    //setup for date comparison
    const newStartDate = new Date(startDate).getTime();
    const newEndDate = new Date(endDate).getTime();

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (userId !== booking.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this booking" });
    }

    const currentDate = new Date().getTime();
    // const exampleEndDate = new Date(endDate).getTime();
    if (newEndDate < currentDate) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot come before startDate",
        },
      });
    }

    const currBookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
      },
    });

    currBookings.forEach((bookings) => {
      //setup for comp
      const bookingStartDate = new Date(
        bookings.dataValues.startDate
      ).getTime();
      const bookingEndDate = new Date(bookings.dataValues.endDate).getTime();

      const errorsObj = {};
      console.log(bookings.dataValues);

      if (bookings.dataValues.id === bookingId) {
        booking.update({
          startDate,
          endDate,
        });

        return res.status(200).json(booking);
      }

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

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//DELETE a booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const deletedBooking = await Booking.findByPk(bookingId, {
      include: Spot,
    });

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }

    // console.log(userId);
    // console.log(deletedBooking.userId);
    // console.log(deletedBooking.Spot.ownerId);

    if (
      deletedBooking.userId !== userId &&
      deletedBooking.Spot.ownerId !== userId
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete to this booking",
      });
    }

    const currentDate = new Date();
    if (new Date(deletedBooking.startDate) < currentDate) {
      return res
        .status(403)
        .json({ message: "Bookings that have been started can't be deleted" });
    }

    deletedBooking.destroy();

    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
