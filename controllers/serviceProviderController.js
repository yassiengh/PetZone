const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const ServiceProvider = require("./../models/serviceProviderModel");

exports.createServiceProvider = (req) => {
  const serviceProvider = ServiceProvider.create(req.body);

  return serviceProvider;
};

exports.updateServiceProvider = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "workingHours",
    "offDays",
    "ratePerhour",
    "landLine"
  );

  const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
