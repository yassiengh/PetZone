const Vaccines = require("../models/vaccineModel");
const Pet = require("../models/petModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addNewVacc = catchAsync(async (req, res, next) => {
  const newVacc = await Vaccines.create(req.body);
  res.status(200).json({
    status: "success",
    data: newVacc,
  });
});
exports.getAllVaccines = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Vaccines.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const vaccine = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: vaccine.length,
    data: {
      vaccine,
    },
  });
});

// exports.getVaccine = catchAsync(async (req, res, next) => {
//   const Vaccine = await Vaccines.findById(req.params.id);

//   if (!Vaccine) {
//     return next(new AppError("No Vaccine found with that ID", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       Vaccine,
//     },
//   });
// });

// exports.addVaccineToHistory = catchAsync(async (req, res, next) => {});

// exports.checkVaccinationHistory = catchAsync(async (req, res, next) => {
//   const pet = await Pet.findById(req.params.id);
//   if (!pet) {
//     return next(new AppError("No pet found with that ID", 404));
//   }
//   if (!pet.history) {
//     return next(new AppError("No history found for that pet", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       pet: history,
//     },
//   });
// });
// // el function de bt3ml eh ? el if condition kda sa7 ?
// // el model me7tag yt2m nosen , wel controller bardo
// exports.getAllAvailableVaccines = catchAsync(async (req, res, next) => {
//   const vaccines = getAllVaccines();
//   const AvailableVacc = [];
//   const pet = await Pet.findById(req.params.id);

//   for (let i = 0; i < vaccines.length; i++) {
//     if (!pet.history.includes(vaccines[i]._id)) {
//       AvailableVacc.add(vaccines[i]);
//     }
//   }
//   //const VacHistory = checkVaccinationHistory(req.params.id);
//   // for (let i = 0; i < VacHistory.length; i++) {
//   //   for (let j = 0; j < vaccines.length; j++) {
//   //     if (vaccines[j] != VacHistory[i]) {
//   //       AvailableVacc.add(vaccines[j]);
//   //     }
//   //   }
//   // }

//   res.status(200).json({
//     status: "success",
//     data: {
//       AvailableVacc,
//     },
//   });
// });
