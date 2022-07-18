const Pet = require("../models/petModel");
const Vaccine = require("../models/vaccineModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const http = require("http");

exports.createVaccinationHistory = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.body.petID);
  const history = req.body.history;

  for (let i = 0; i < history.length; i++) {
    let vacc = await Vaccine.findById(history[i].id);
    if (vacc.forPets != pet.petType)
      return next(
        new AppError("this vaccine is not for this type of pet", 404)
      );
    let obj = {};

    if (history[i].day && history[i].month && history[i].year) {
      obj["vaccine"] = history[i].id;
      let date = new Date(
        history[i].year,
        history[i].month - 1,
        history[i].day
      );
      obj["lastTimeTaken"] = date;
      pet.desiredVaccines.push({ vaccine: history[i].id });
    } else {
      obj["vaccine"] = history[i].id;
    }

    pet.history.push(obj);
  }

  pet.checkedVaccines = true;

  await Pet.findByIdAndUpdate(req.body.petID, pet);

  res.status(200).json({
    status: "success",
    data: pet,
  });
});

exports.availableVaccines = catchAsync(async (req, res) => {
  const pet = await Pet.findById(req.query.id).populate("history.vaccine");

  // get all pet vaccines from DB
  var rawData = "";
  const promise = () => {
    return new Promise((resolve) => {
      http.get(
        `http://127.0.0.1:3000/api/v1/vaccinationDB/?forPets=${pet.petType}`,
        function (res) {
          res.on("data", (chunk) => {
            rawData += chunk;
          });
          res.on("end", () => {
            resolve(rawData);
          });
        }
      );
    });
  };
  rawData = await promise();

  rawData = JSON.parse(rawData);
  const history = pet.history;

  // add IDs for comparison
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

  // seperate recurring from non recurring to calculate recurring vaccines dates
  let recurringDesiredVaccines = pet.desiredVaccines.filter(
    (desiredVaccine) => desiredVaccine.vaccine.recurring == true
  );
  let nonrecurringDesiredVaccines = pet.desiredVaccines.filter(
    (desiredVaccine) => desiredVaccine.vaccine.recurring == false
  );

  //calculate dates
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  // get a day with only year,month,day and no hours or minutes
  let todayWithNoHours = new Date(year, month - 1, day);

  recurringDesiredVaccines.forEach((recurringDesiredVaccine) => {
    let historyForDesiredVaccine = pet.history.filter(
      (v) => recurringDesiredVaccine.vaccine.id == v.vaccine
    );
    if (historyForDesiredVaccine.length == 1) {
      let lastTimeTakenDate = new Date(
        historyForDesiredVaccine[0].lastTimeTaken
      );
      let Difference_In_Time =
        todayWithNoHours.getTime() - lastTimeTakenDate.getTime();
      let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      let differenceBetweenDates =
        recurringDesiredVaccine.vaccine.recurringEvery * 30 -
        Difference_In_Days;
      if (differenceBetweenDates < 0) differenceBetweenDates = 0;

      recurringDesiredVaccine.timeRemaining = differenceBetweenDates;
    }
  });

  let arr = recurringDesiredVaccines.concat(nonrecurringDesiredVaccines);
  arr = arr.map((r) => {
    let obj = { vaccine: r.vaccine.id, timeRemaining: r.timeRemaining };
    return obj;
  });

  await Pet.findByIdAndUpdate(petID, { desiredVaccines: arr }).populate(
    "desiredVaccines.vaccine"
  );
  res.status(200).json({
    status: "success",
    data: recurringDesiredVaccines.concat(nonrecurringDesiredVaccines),
  });
});

exports.fillDesiredVaccines = catchAsync(async (req, res, next) => {
  petID = req.body.petID;
  const pet = await Pet.findById(petID).populate("desiredVaccines.vaccine");

  alreadyDesiredVaccines = pet.desiredVaccines;
  vaccinesToAdd = req.body.desiredVaccines;

  //make sure all vaccines to add are for the correct pet type
  let vacc = await Vaccine.find({ _id: { $in: vaccinesToAdd } });
  for (let i = 0; i < vacc.length; i++) {
    if (vacc[i].forPets != pet.petType)
      return next(
        new AppError("this vaccine is not for this type of pet", 404)
      );
  }

  vaccinesToAdd.forEach((vacc) => {
    if (!alreadyDesiredVaccines.includes(vacc)) {
      alreadyDesiredVaccines.push({ vaccine: vacc.toString() });
    }
  });

  pet.desiredVaccines = alreadyDesiredVaccines;
  await Pet.findByIdAndUpdate(petID, pet);
  res.status(200).json({
    status: "success",
    data: pet,
  });
});
