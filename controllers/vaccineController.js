const Pet = require("../models/petModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const http = require("http");

exports.createVaccinationHistory = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.body.petID);
  const history = req.body.history;
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
  const pet = await Pet.findById(req.query.id).populate("history.vaccine");
  const history = pet.history;

  let availableVaccines = [];
  let vaccineHistory = [];
  history.forEach((vaccine) => {
    vaccineHistory.push(vaccine.vaccine.id);
  });
  rawData.data.vaccine.forEach((obj) => {
    if (!vaccineHistory.includes(obj._id)) {
      availableVaccines.push(obj);
    }
  });
  res.status(200).json({
    status: "success",
    data: availableVaccines,
  });
});

exports.getDesiredVaccines = catchAsync(async (req, res) => {
  petID = req.query.petID;
  const pet = await Pet.findById(petID).populate("desiredVaccines.vaccine");
  res.status(200).json({
    status: "success",
    data: pet.desiredVaccines,
  });
});
exports.fillDesiredVaccines = catchAsync(async (req, res) => {
  petID = req.body.petID;
  const pet = await Pet.findById(petID).populate("desiredVaccines.vaccine");
  desiredVaccinesList = pet.desiredVaccines;
  vaccinesToAdd = req.body.desiredVaccines;
  let vaccineListIDs = [];
  desiredVaccinesList.forEach((desiredVacc) => {
    vaccineListIDs.push(desiredVacc.vaccine.id);
  });
  console.log(vaccineListIDs, vaccinesToAdd);
  vaccinesToAdd.forEach((vacc) => {
    if (!vaccineListIDs.includes(vacc)) {
      desiredVaccinesList.push({ vaccine: vacc.toString() });
    }
  });

  pet.desiredVaccines = desiredVaccinesList;
  await Pet.findByIdAndUpdate(petID, pet);
  res.status(200).json({
    status: "success",
    data: pet,
  });
});
