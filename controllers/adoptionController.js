const adoptedPets = require("../models/petModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllAdoptedPets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    adoptedPets.find({ adopted: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const adoptedpet = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: adoptedpet.length,
    data: {
      adoptedpet,
    },
  });
});

exports.getAdoptedPet = catchAsync(async (req, res, next) => {
  const adoptedpet = await adoptedPets.findById(req.params.id, {
    adopted: true,
  });

  if (!adoptedpet || adoptedpet.adopted === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      adoptedpet,
    },
  });
});

exports.adoptPet = catchAsync(async (req, res, next) => {
  const adoptedpet = await adoptedPets.findByIdAndUpdate(req.params.id);

  if (!adoptedpet || adoptedpet.offerAdoption === true) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }

  adoptedpet.adopted = true;
  res.status(201).json({
    status: "success",
    adoptedpet,
  });
});

exports.deleteAdoptedPet = catchAsync(async (req, res, next) => {
  const adoptedpet = await adoptedPets.findByIdAndUpdate(req.params.id);

  if (!adoptedpet || adoptedpet.adopted === false) {
    return next(
      new AppError("No pet found with that ID or Not offered for adoption", 404)
    );
  }
  adoptedpet.adopted = false;
  res.status(204).json({
    status: "success",
  });
});

// exports.updateAdoptedPet = catchAsync(async (req, res, next) => {
//   const adoptedpet = await adoptedPets.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!adoptedpet && adoptedpet.adopted === false) {
//     return next(
//       new AppError("No pet found with that ID or Not offered for adoption", 404)
//     );
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       adoptedpet,
//     },
//   });
// });
