const Pet = require("../models/petModel");
const PetOwner = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const http = require("http");

exports.getAllPets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Pet.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const pets = await features.query;

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

exports.createVaccinationHistory = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.body.petID);
  const history = req.body.history;
  console.log(history);
  console.log(pet);
  history.forEach((vaccine) => {
    let obj = {};

    if (vaccine.date) {
      obj["vaccine"] = vaccine.id;
      obj["lastTimeTaken"] = vaccine.date;
    } else {
      obj["vaccine"] = vaccine.id;
    }

    pet.history.push(obj);
  });
  pet.checkedVaccines = true;
  await Pet.findByIdAndUpdate(req.body.petID, pet);

  res.status(200).json({
    status: "success",
    data: pet,
  });
});

exports.availableVaccines = catchAsync(async (req, res) => {
  var rawData = "";
  const promise = () => {
    return new Promise((resolve) => {
      http.get("http://127.0.0.1:3000/api/v1/vaccination/", function (res) {
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          resolve(rawData);
        });
      });
    });
  };
  rawData = await promise();
  rawData = JSON.parse(rawData);
  const pet = await Pet.findById(req.query.id);
  const history = pet.history;

  let availableVaccines = [];
  rawData.data.vaccine.forEach((obj) => {
    history.forEach((vaccine) => {
      console.log(obj._id);
      console.log(vaccine.vaccine);
      console.log("-----");
      if (!obj._id == vaccine) {
        availableVaccines.push(obj._id);
      }
    });
  });
  console.log(rawData.data.vaccine, history, availableVaccines);
  res.status(200).json({
    status: "success",
    data: rawData,
  });
});
