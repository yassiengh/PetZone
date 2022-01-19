const express = require("express");
const offerBreedingController = require("../controllers/offerBreedingController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, offerBreedingController.getAllBreedingOffers)
  // .post(authController.protect, adoptionController.adoptPet);

router
  .route("/:id")
  .get(offerBreedingController.getBreedingOffer)
  .post(authController.protect, offerBreedingController.offerPetBreeding)
  .delete(
    authController.protect,
    authController.restrictTo("pet owner", "admin"),
    offerBreedingController.deleteBreedingOffer
  );

module.exports = router;