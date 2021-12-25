const express = require("express");
const adoptionController = require("../controllers/adoptionController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/:id")
  .post(authController.protect, adoptionController.adoptPet)

module.exports = router;
