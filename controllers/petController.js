const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Pet = require("../models/petModel");
const PetOwner = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
      console.log(req);
      return `pet-${req.user.id}-${Date.now()}`;
    },
    folder: "pets",
    unique_filename: false,
  },
});

const multerStorageSignup = new CloudinaryStorage({
  cloudinary,
  params: {
    use_filename: true,
    filename_override: function (req) {
      return `pet-${req.body.petName}-${Date.now()}`;
    },
    folder: "pets",
    unique_filename: false,
  },
});

const upload = multer({ storage: multerStorage });

const uploadSignup = multer({
  storage: multerStorageSignup,
});

exports.uploadPetPhoto = upload.single("photo");

exports.uploadPetPhotoSignup = uploadSignup.single("photo");

exports.getAllPets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Pet.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const pets = await features.query;
  console.log(req.cookies);
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: pets.length,
    data: {
      pets,
    },
  });
});

exports.getPet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return next(new AppError("No pet found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      pet,
    },
  });
});

exports.createPet = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.petProfilePic = req.file.path;
  }
  const newPet = await Pet.create(req.body);
  const Petowner = await PetOwner.findById(req.user._id);
  Petowner.POA.childPet.push(newPet._id);
  Petowner.POA.numberOfPets = Petowner.POA.childPet.length;
  await PetOwner.findByIdAndUpdate(req.user._id, Petowner);
  res.status(201).json({
    status: "success",
    data: {
      pet: newPet,
    },
  });
});

exports.updatePet = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.petProfilePic = req.file.path;
  }
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!pet) {
    return next(new AppError("No pet found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      pet,
    },
  });
});

exports.deletePet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  const Petowner = await PetOwner.findById(req.user._id);
  const index = Petowner.POA.childPet.indexOf(pet._id);
  if (index > -1) {
    Petowner.POA.childPet.splice(index, 1);
  }
  Petowner.POA.numberOfPets = Petowner.POA.childPet.length;
  await PetOwner.findByIdAndUpdate(req.user._id, Petowner);
  if (!pet) {
    return next(new AppError("No pet found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
