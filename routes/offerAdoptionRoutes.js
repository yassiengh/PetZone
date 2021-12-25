const express = require("express");
const offerAdoptionController = require("../controllers/offerAdoptionController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, offerAdoptionController.getAllAdoptionOffers)
  // .post(authController.protect, adoptionController.adoptPet);

router
  .route("/:id")
  .get(offerAdoptionController.getAdoptedOffer)
  .post(authController.protect, offerAdoptionController.offerPetAdoption)
  .delete(
    authController.protect,
    authController.restrictTo("pet owner", "admin"),
    offerAdoptionController.deleteAdoptionOffer
  );

module.exports = router;