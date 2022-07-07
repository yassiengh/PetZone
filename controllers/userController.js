const User = require("./../models/userModel");
const multer = require("multer");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const upload = multer({ dest: "public/img/users" });

exports.uploadUserPhoto = upload.single("photo");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = catchAsync(async (req, res, next) => {
  console.log("C:\\Users\\yassi\\Desktop\\PetZone\\default.jpg");
  const currentUser = await User.findById(req.user.id).populate("POA.childPet");
  // sendfile(`${__dirname}/./default.jpg`).
  // res.status(200).json({
  //   data: {
  //     currentUser,
  //   },
  // });
  res.status(200).json({ currentUser });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().populate("POA.childPet");

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "userName",
    "country",
    "address",
    "city",
    "phoneNumber",
    "serviceProvider"
  );

  if (req.file) filteredBody.profilePicture = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllVets = catchAsync(async (req, res, next) => {
  const vets = await User.find({ "serviceProvider.type": "Vet" });

  res.status(200).json({
    data: vets,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
