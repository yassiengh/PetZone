const express = require("express");
const vaccineController = require("../controllers/vaccineController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/VaccinationHistory")
  .post(vaccineController.createVaccinationHistory);

router.route("/availableVaccines").get(vaccineController.availableVaccines);

router
  .route("/desiredVaccines")
  .get(vaccineController.getDesiredVaccines)
  .patch(vaccineController.fillDesiredVaccines);

module.exports = router;
