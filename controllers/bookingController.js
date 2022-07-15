const appointment = require("../models/appointmentsModel");
const vetWorkingDays = require("../models/vetWorkingDaysModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.test = catchAsync(async (req, res, next) => {
  //   let today = new Date(year, month, day);
  //   console.log(today);
  //   let dd = String(today.getDate()).padStart(2, "0");
  //   let mm = String(today.getMonth() + 1).padStart(2, "0");
  //   let yyyy = today.getFullYear();
  //   today = dd + "-" + mm + "-" + yyyy;
  //   res.status(200).json({
  //     data: today,
  //   });
});

exports.loadVet = catchAsync(async (req, res, next) => {
  const vet = await User.findById(req.params.id);
  const offDays = vet.serviceProvider.offDays;
  let schedule = await vetWorkingDays.find({ doctor: req.params.id });

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
      array.push(workingDay);
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
    await vetWorkingDays.create(object);
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

    // add new missing dates
    for (let i = lengthWorkingDays; i < 7; i++) {
      workingDays.push({
        date: new Date(year, month - 1, day + i),
        numberOfFreeAppointments: vet.serviceProvider.ratePerHour,
      });
    }

    workingDays.forEach((day) => {
      let currentDay = new Date(day.date);
      let dayIndex = currentDay.getDay();
      if (offDaysIndex.includes(dayIndex)) {
        day.date = "0";
      }
    });
    workingDays = workingDays.filter((day) => day.date != "0");

    object = await vetWorkingDays.findByIdAndUpdate(
      schedule[0]._id,
      { workingDays: workingDays },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  res.status(200).json({
    data: object,
    vet,
  });
});

exports.bookVet = catchAsync(async (req, res, next) => {
  const { doctor, patient, day } = req.body;
  // let vetWorkingDays = await vetWorkingDays.find({ "workingDays.id": day });
  let a = await appointment.create(req.body);
  res.status(200).json({ a });
  // await vetWorkingDays.findByIdAndUpdate(day,workingDays)
});
("Fri Jul 06 2022 00:00:00 GMT+0200 (Eastern European Standard Time)");

let x = new Date(
  "Fri Jul 06 2022 00:00:00 GMT+0200 (Eastern European Standard Time)"
);

x.getDay();
