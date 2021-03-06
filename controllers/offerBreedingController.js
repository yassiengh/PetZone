const breedingOffers = require("../models/petModel");
const user = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBreedingOffers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    breedingOffers.find({ offerBreeding: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const breedingOffer = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: breedingOffer.length,
    data: {
        breedingOffer,
    },
  });
});

exports.getBreedingOffer = catchAsync(async (req, res, next) => {
  const breedingOffer = await breedingOffers.findById(req.params.id, {
    offerBreeding: true,
  });

  if (!breedingOffer || breedingOffer.offerBreeding === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
        breedingOffer,
    },
  });
});

exports.offerPetBreeding = catchAsync(async (req, res, next) => {
  const breedingOffer = await breedingOffers.findById(req.params.id);
  const User = await user.findById(req.user._id)
  if(!User.POA.childPet.includes(breedingOffer.id))
  { 
    return next(
      new AppError("You cant offer pet  you are not own for breeding")
    );
  }
  if (!breedingOffer || breedingOffer.offerBreeding === true) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }
  breedingOffer.breeding = true;
  breedingOffer.offerBreeding = true;
  await breedingOffers.findByIdAndUpdate(req.params.id, breedingOffer);

  res.status(201).json({
    status: "success",
    pet: breedingOffer,
  });
});

exports.deleteBreedingOffer = catchAsync(async (req, res, next) => {
  const breedingOffer = await breedingOffers.findByIdAndUpdate(req.params.id);
  const User = await user.findById(req.user._id)
  if(!User.POA.childPet.includes(breedingOffer.id))
  { 
    return next(
      new AppError("You cant remove this offer")
    );
  }

  if (!breedingOffer || breedingOffer.offerBreeding === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }
  breedingOffer.offerBreeding = false;
  await breedingOffers.findByIdAndUpdate(req.params.id, breedingOffer);
  res.status(204).json({
    status: "success",
  });
});
