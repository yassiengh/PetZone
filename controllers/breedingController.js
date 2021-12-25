const breedingPets = require("../models/petModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBreedingPets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    breedingPets.find({ breeding: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const breedingPet = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: breedingPet.length,
    data: {
      breedingPet,
    },
  });
});

exports.getBreedingPets = catchAsync(async (req, res, next) => {
  const breedingPet = await breedingPets.findById(req.params.id, {
    breeding: true,
  });

  if (!breedingPet || breedingPet.breeding === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for breeding", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      breedingPet,
    },
  });
});

exports.BreedPet = catchAsync(async (req, res, next) => {
  // const adoptedpet = await adoptedPets.create(req.body);
  const breedingPet = await breedingPets.findByIdAndUpdate(req.params.id);

  if (!breedingPet || breedingPet.breeding === true) {
    return next(
      new AppError("No pet found with that ID or you cant get this pet for breeding", 404)
    );
  }
  breedingPet.breeding = true;
  res.status(201).json({
    status: "success",
    data: breedingPet
  });
});

exports.deleteBreedingPet = catchAsync(async (req, res, next) => {
  const breedingPet = await breedingPets.findByIdAndDelete(req.params.id);

  if (!breedingPet || breedingPet.breeding === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for breeding", 404)
    );
  }
  breedingPet.breeding = false;
  res.status(204).json({
    status: "success",
  });
});

// exports.updateBreedingPet = catchAsync(async (req, res, next) => {
//   const breedingPet = await breedingPets.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!breedingPet && breedingPet.breeding === false) {
//     return next(
//       new AppError("No pet found with that ID or Not offered for adoption", 404)
//     );
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       breedingPet,
//     },
//   });
// });
