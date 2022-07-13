const catchAsync = require("../utils/catchAsync");
const userReports = require("../models/userReportsModel");
const User = require("./../models/userModel");

exports.getUserReports = catchAsync(async (req, res, next) => {
  const reports = await userReports.find();
  res.status(200).json({ reports });
});

exports.createUserReport = catchAsync(async (req, res, next) => {
  const report = await userReports.create(req.body);
  res.status(200).json({ report });
});

exports.getReport = catchAsync(async (req, res, next) => {
  const report = await userReports.findById(req.params.id);
  res.status(200).json({ report });
});

exports.banAccountUsingReport = catchAsync(async (req, res, next) => {
  const report = await userReports.findById(req.params.id);
  await User.findByIdAndUpdate(report.reported, { active: false });

  res.status(200).json({});
});

exports.banAccountUsingId = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(200).json({});
});

exports.getAllUsersWaitingForIDVerification = catchAsync(
  async (req, res, next) => {
    let users = await User.find({ verifiedNationalID: false });
    users = users.filter((user) => user.nationalID);

    res.status(200).json({ users });
  }
);

exports.verifyUserNationalID = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { verifiedNationalID: true });

  res.status(200).json({});
});
