const adoptedPets = require("../models/petModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


exports.adoptPet = catchAsync(async (req, res, next) => {
  const adoptedpet = await adoptedPets.findById(req.params.id);

  if (!adoptedpet || adoptedpet.offerAdoption === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }

  adoptedpet.adopted = true;
  adoptedpet.offerAdoption = false;
  await adoptedPets.findByIdAndUpdate(req.params.id, adoptedpet);


  res.status(201).json({
    status: "success",
    adoptedpet,
  });
});


