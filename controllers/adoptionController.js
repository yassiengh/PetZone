const adoptedPets = require("../models/petModel");
const user = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.adoptPet = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const adoptedpet = await adoptedPets.findById(req.params.id);
  const currentUser = await user.findById(req.user._id);
  const petOwner = await user.find({ "POA.childPet": adoptedpet.id });

  if (currentUser.POA.childPet.includes(adoptedpet.id)) {
    return next(new AppError("You cant adopt pet you already own "));
  }
  if (!adoptedpet || adoptedpet.offerAdoption === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }

  //update the offer adoption
  adoptedpet.adopted = true;
  adoptedpet.offerAdoption = false;
  await adoptedPets.findByIdAndUpdate(req.params.id, adoptedpet);

  //push the adopted pet to the logged in user
  currentUser.POA.childPet.push(adoptedpet.id);
  currentUser.POA.numberOfPets = currentUser.POA.childPet.length;
  await user.findByIdAndUpdate(req.user._id, currentUser);

  //delete the pet from his owner account and update the length
  const index = petOwner[0].POA.childPet.indexOf(adoptedpet._id);
  if (index > -1) {
    petOwner[0].POA.childPet.splice(index, 1);
  }
  petOwner[0].POA.numberOfPets = petOwner[0].POA.childPet.length;
  await user.findByIdAndUpdate(petOwner[0]._id, petOwner[0]);

  res.status(201).json({
    status: "success",
    adoptedpet,
  });
});
