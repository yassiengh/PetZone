const express = require('express');
const petController = require('../controllers/petController');
const authController = require('../controllers/authController');


const router = express.Router();


router
  .route('/')
  .get(authController.protect, petController.getAllPets)
  .post(authController.protect, petController.createPet);

router
  .route('/:id')
  .get(petController.getPet)
  .patch(petController.updatePet)

  //only the logged in pet owner and the admin can delete the pet profile 
  .delete(
    authController.protect,
    authController.restrictTo('pet owner', 'admin'),
    petController.deletePet
  );

module.exports = router;
