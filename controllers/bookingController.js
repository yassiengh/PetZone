const appointment = require("../models/appointmentsModel");
const vetWorkingDays = require("../models/vetWorkingDaysModel");
const User = require("../models/userModel");
const Days = require("../models/workingDaysModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.loadVet = catchAsync(async (req, res, next) => {
  const vet = await User.findById(req.params.id);
  const offDays = vet.serviceProvider.offDays;
  let schedule = await vetWorkingDays
    .find({ doctor: req.params.id })
    .populate("workingDays");

  // Map to remove Offdays
  let offDaysMap = new Map();
  offDaysMap.set("Sun", 0);
  offDaysMap.set("Mon", 1);
  offDaysMap.set("Tue", 2);
  offDaysMap.set("Wed", 3);
  offDaysMap.set("Thu", 4);
  offDaysMap.set("Fri", 5);
  offDaysMap.set("Sat", 6);
  let offDaysIndex = offDays.map((day) => {
    return offDaysMap.get(day);
  });

  let object = {};
  let array = [];
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let todayWithNoHours = new Date(year, month - 1, day);
  // First time loading vet profile, fill all booking slots
  if (schedule.length === 0) {
    for (let i = 0; i < 7; i++) {
      let date = new Date(year, month - 1, day + i);
      let workingDay = {
        date,
        numberOfFreeAppointments: vet.serviceProvider.ratePerHour,
      };
      let newDay = await Days.create(workingDay);
      array.push(newDay);
    }
    // remove offdays
    array.forEach((day) => {
      let currentDay = new Date(day.date);
      let dayIndex = currentDay.getDay();
      if (offDaysIndex.includes(dayIndex)) {
        day.date = "0";
      }
    });
    array = array.filter((day) => day.date != "0");

    object = { doctor: req.params.id, workingDays: array };

    array = array.map((day) => {
      return day.id;
    });

    document = { doctor: req.params.id, workingDays: array };

    await vetWorkingDays.create(document);
  }
  // not first time loading vet profile, check for past (irrelevant slots) and make new ones for the future
  else {
    let workingDays = schedule[0].workingDays;

    workingDays = workingDays.filter(
      (day) => new Date(day.date) >= todayWithNoHours
    );
    let lengthWorkingDays = workingDays.length;
    // if all days in the DB are in the past
    if (lengthWorkingDays == 0) {
      for (let i = 0; i < 7; i++) {
        let date = new Date(year, month - 1, day + i);
        let workingDay = {
          date,
          numberOfFreeAppointments: vet.serviceProvider.ratePerHour,
        };
        array.push(workingDay);
      }
      object = { doctor: req.params.id, workingDays: array };
    }

    // add new missing dates if not duplicate
    let dates = [];
    workingDays.forEach((d) => dates.push(JSON.stringify(new Date(d.date))));
    for (let i = lengthWorkingDays; i < 7; i++) {
      let newdate = new Date(year, month - 1, day + i);
      if (!dates.includes(JSON.stringify(newdate))) {
        workingDays.push({
          date: new Date(year, month - 1, day + i),
          numberOfFreeAppointments: vet.serviceProvider.ratePerHour,
        });
      }
    }

    workingDays.forEach((day) => {
      let currentDay = new Date(day.date);
      let dayIndex = currentDay.getDay();
      if (offDaysIndex.includes(dayIndex)) {
        day.date = "0";
      }
    });
    workingDays = workingDays.filter((day) => day.date != "0");

    let daysID = [];
    for (let i = 0; i < workingDays.length; i++) {
      let newDay = await Days.create(workingDays[i]);
      daysID.push(newDay.id);
    }

    await vetWorkingDays.findByIdAndUpdate(
      schedule[0]._id,
      { workingDays: daysID },
      {
        new: true,
        runValidators: true,
      }
    );
    object = { doctor: req.params.id, workingDays };
  }

  res.status(200).json({
    data: object,
    vet,
  });
});

exports.bookVet = catchAsync(async (req, res, next) => {
  const { doctor, patient, day } = req.body;
  let selectedDay = await Days.findById(day);
  // check if appointment already exists
  let app = await appointment.find({
    doctor: doctor,
    patient: patient,
    day: day,
  });
  if (app) next(new AppError("an appointment already exists on that day", 404));
  console.log(selectedDay.numberOfAppointments);
  await Days.findByIdAndUpdate(day, {
    numberOfFreeAppointments: selectedDay.numberOfFreeAppointments - 1,
  });
  await appointment.create(req.body);

  res.status(200).json({ status: "success" });
});

exports.deleteDays = catchAsync(async (req, res, next) => {
  await Days.deleteMany();
  res.status(200).json({});
});
