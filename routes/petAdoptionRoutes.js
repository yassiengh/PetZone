const express = require("express");
const adoptionController = require("../controllers/adoptionController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, adoptionController.getAllAdoptedPets)
  // .post(authController.protect, adoptionController.adoptPet);

router
  .route("/:id")
  .get(adoptionController.getAdoptedPet)
  .post(authController.protect, adoptionController.adoptPet)
  .delete(
    authController.protect,
    authController.restrictTo("pet owner", "admin"),
    adoptionController.deleteAdoptedPet
  );

module.exports = router;
