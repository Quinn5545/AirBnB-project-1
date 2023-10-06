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

    let bookingsList = [];
    bookings.forEach((book) => {
      bookingsList.push(book.toJSON());
    });

    bookingsList.forEach((book) => {
      //   console.log(book.Spot.SpotImages);
      book.Spot.previewImage = book.Spot.SpotImages;
      delete book.Spot.SpotImages;
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

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    if (userId !== booking.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this booking" });
    }

    const currentDate = new Date();
    if (new Date(endDate) < currentDate) {
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

    const existingBookingConflict = await Booking.findOne({
      where: {
        spotId: booking.spotId,
        [Op.not]: {
          id: booking.id, // excludes the current booking from the conflict check
        },
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

    if (existingBookingConflict) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    await booking.update({
      startDate,
      endDate,
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

    const deletedBooking = await Booking.findByPk(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }

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
