const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.route("/bookVet").post(bookingController.bookVet);

module.exports = router;
