const ratings = require("../models/ratingsModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.rateProvider = catchAsync(async (req, res, next) => {
  const { user, serviceProvider, rating } = req.body;

  const alreadyReviewed = await ratings.find({
    user,
    serviceProvider,
  });

  if (alreadyReviewed.length != 0)
    next(new AppError("User already reviewed this provider", 404));

  await ratings.create(req.body);

  //   const provider = await user.findById(providerID);
  const providerReviews = await ratings.find({ serviceProvider });

  let totalRatings = 0;
  providerReviews.forEach((rating) => {
    totalRatings += rating.rating;
  });

  totalRatings /= providerReviews.length;
  await User.findByIdAndUpdate(serviceProvider, {
    "serviceProvider.rating": Math.floor(totalRatings),
  });

  res.status(201).json({ newRating: totalRatings });
});
