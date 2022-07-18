const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router
  .route("/bookServiceProvider")
  .post(bookingController.bookServiceProvider);
router.route("/cancelBooking").post(bookingController.cancelBooking);
router.route("/days").delete(bookingController.deleteDays);
router
  .route("/deleteAppointments")
  .delete(bookingController.deleteAppointments);

module.exports = router;
