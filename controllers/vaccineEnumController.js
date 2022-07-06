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
