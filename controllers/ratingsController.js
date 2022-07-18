const ratings = require("../models/ratingsModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.rateProvider = catchAsync(async (req, res, next) => {
  const { user, serviceProvider } = req.body;

  const alreadyReviewed = await ratings.find({
    user,
    serviceProvider,
    mostRecent: true,
  });

  // if a review already exists
  if (alreadyReviewed.length != 0) {
    mostRecentRatingID = alreadyReviewed[0].id;
    await ratings.findByIdAndUpdate(mostRecentRatingID, { mostRecent: false });
  }

  let today = new Date();
  req.body.date = today;

  await ratings.create(req.body);

  const providerReviews = await ratings.find({
    serviceProvider,
    mostRecent: true,
  });

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
