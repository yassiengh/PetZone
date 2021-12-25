const express = require("express");
const breedingController = require("../controllers/breedingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, breedingController.getAllBreedingPets)
  // .post(authController.protect, breedingController.BreedPet);

router
  .route("/:id")
  .get(breedingController.getBreedingPets)
  .post(authController.protect, breedingController.BreedPet)
  .delete(
    authController.protect,
    authController.restrictTo("pet owner", "admin"),
    breedingController.deleteBreedingPet
  );

module.exports = router;
