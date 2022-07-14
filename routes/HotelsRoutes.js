const express = require("express");
const hotelsController = require("../controllers/hotelsController");

const router = express.Router();

router.route("/importHotels").post(hotelsController.importHotelFromXLSX);
router.route("/").post(hotelsController.getHotelsSortedByDistance);
module.exports = router;
