const express = require("express");
const vaccineController = require("../controllers/vaccineEnumController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(vaccineController.getAllVaccines)
  .post(authController.protect, vaccineController.addNewVacc);

module.exports = router;
