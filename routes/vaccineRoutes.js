const express = require("express");
const vaccineController = require("../controllers/vaccineController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(vaccineController.getAllVaccines)
  .post(authController.protect, vaccineController.addNewVacc);

// router.get('/getAllAvailableVaccines', authController.protect, vaccineController.getAllAvailableVaccines)
// router.get('/checkHistory', authController.protect, vaccineController.checkVaccinationHistory)
// router.patch('/addVaccineToHistory/:id', authController.protect, vaccineController.addVaccineToHistory)
// router
//   .route('/:id')
//   .get(authController.protect, vaccineController.getVaccine)

module.exports = router;
