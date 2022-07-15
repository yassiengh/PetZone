const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("./../models/userModel");
const VetAppointment = require("./../models/appointmentsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const distanceCalculator = require("./../utils/distanceCalculator");

cloudinary.config({
  cloud_name: "petzone",
  api_key: "665311693884718",
  api_secret: "ZkkQgzfKk4kcfeKVRkvZ3I8RpBw",
});

const multerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    use_filename: true,
    filename_override: function (req) {
      return `user-${req.user.id}`;
    },
    folder: "users",
    unique_filename: false,
  },
});

const multerStorageSignup = new CloudinaryStorage({
  cloudinary,
  params: {
    use_filename: true,
    filename_override: function (req) {
      return `user-${req.body.email}`;
    },
    folder: "users",
    unique_filename: false,
  },
});

const upload = multer({ storage: multerStorage });

const uploadSignup = multer({
  storage: multerStorageSignup,
});

exports.uploadUserPhoto = upload.single("photo");

exports.uploadUserPhotoSignup = uploadSignup.single("photo");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id).populate("POA.childPet");

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

  if (req.file) filteredBody.profilePicture = req.file.path;

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

exports.getAllVetAppointment = catchAsync(async (req, res, next) => {
  const appointments = await VetAppointment.find({
    doctor: req.params.id,
  });
  res.status(200).json({
    data: appointments,
  });
});

exports.getAllSortedServiceProvidersByDistance = catchAsync(
  async (req, res, next) => {
    let users = await User.find({
      "serviceProvider.type": `${req.body.type}`,
    });
    users = users.filter((user) => user.serviceProvider.location.latitude);
    let userLat = req.body.latitude;
    let userLong = req.body.longitude;
    users.forEach((user) => {
      let d = distanceCalculator(
        userLat,
        userLong,
        user.serviceProvider.location.latitude,
        user.serviceProvider.location.longitude
      );
      user.serviceProvider.location["distance"] = d;
    });

    users.sort((a, b) => {
      return (
        a.serviceProvider.location.distance -
        b.serviceProvider.location.distance
      );
    });

    res.status(200).json({
      results: users.length,
      data: users,
    });
  }
);

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    user,
  });
});
