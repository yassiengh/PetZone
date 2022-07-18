const appointment = require("../models/appointmentsModel");
const userWorkingDays = require("../models/userWorkingDaysModel");
const User = require("../models/userModel");
const Days = require("../models/workingDaysModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.loadServiceProvider = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user.role == "pet owner")
    return next(new AppError("users cant be booked", 404));

  const offDays = user.serviceProvider.offDays;
  let schedule = await userWorkingDays
    .find({ serviceProvider: req.params.id })
    .populate("workingDays");

  // Map with off days indices
  let offDaysMap = new Map();
  offDaysMap.set("Sun", 0);
  offDaysMap.set("Mon", 1);
  offDaysMap.set("Tue", 2);
  offDaysMap.set("Wed", 3);
  offDaysMap.set("Thu", 4);
  offDaysMap.set("Fri", 5);
  offDaysMap.set("Sat", 6);
  //populate offdays indices
  let offDaysIndex = offDays.map((day) => {
    return offDaysMap.get(day);
  });

  let object = {};
  let array = [];
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  // get a day with only year,month,day and no hours or minutes
  let todayWithNoHours = new Date(year, month - 1, day);

  // First time loading user profile, fill all booking slots
  if (schedule.length === 0) {
    for (let i = 0; i < 7; i++) {
      let date = new Date(year, month - 1, day + i);
      let workingDay = {
        date,
        numberOfFreeAppointments: user.serviceProvider.ratePerHour,
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

    object = { serviceProvider: req.params.id, workingDays: array };

    array = array.map((day) => {
      return day.id;
    });

    document = { serviceProvider: req.params.id, workingDays: array };

    await userWorkingDays.create(document);
  }
  // not first time loading user profile, check for past ("expired" slots) and make new ones for the future
  else {
    let workingDays = schedule[0].workingDays;

    //Keep current and newer dates
    workingDays = workingDays.filter(
      (day) => new Date(day.date) >= todayWithNoHours
    );

    // if all days in the DB are in the past and removed
    let lengthWorkingDays = workingDays.length;
    if (lengthWorkingDays == 0) {
      for (let i = 0; i < 7; i++) {
        let date = new Date(year, month - 1, day + i);
        let workingDay = {
          date,
          numberOfFreeAppointments: user.serviceProvider.ratePerHour,
        };
        array.push(workingDay);
      }
      object = { serviceProvider: req.params.id, workingDays: array };
    }

    // **add new missing dates if not duplicate**

    // add current dates as strings for comparison later
    let dates = [];
    workingDays.forEach((d) => dates.push(JSON.stringify(new Date(d.date))));

    for (let i = lengthWorkingDays; i < 7; i++) {
      let newdate = new Date(year, month - 1, day + i);
      if (!dates.includes(JSON.stringify(newdate))) {
        workingDays.push({
          date: new Date(year, month - 1, day + i),
          numberOfFreeAppointments: user.serviceProvider.ratePerHour,
        });
      }
    }

    // filter offDays
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

    await userWorkingDays.findByIdAndUpdate(
      schedule[0]._id,
      { workingDays: daysID },
      {
        new: true,
        runValidators: true,
      }
    );
    object = { serviceProvider: req.params.id, workingDays };
  }

  res.status(200).json({
    data: object,
    user,
  });
});

exports.bookServiceProvider = catchAsync(async (req, res, next) => {
  const { serviceProvider, user, day } = req.body;
  let selectedDay = await Days.findById(day);
  if (!selectedDay) {
    return next(new AppError("this day doesnt exist", 404));
  }
  // check if appointment already exists
  let app = await appointment.find({
    serviceProvider: serviceProvider,
    user: user,
    day: day,
  });
  console.log(app);
  if (app.length != 0)
    return next(new AppError("an appointment already exists on that day", 404));

  await Days.findByIdAndUpdate(day, {
    numberOfFreeAppointments: selectedDay.numberOfFreeAppointments - 1,
  });
  await appointment.create(req.body);

  res.status(200).json({ status: "success" });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const { serviceProvider, user, day } = req.body;

  let selectedDay = await Days.findById(day);
  console.log(selectedDay);
  if (selectedDay.length == 0)
    return next(new AppError("Cant find this appointment", 404));

  let provider = await User.findById(serviceProvider);
  let newAppointmentsCounter = selectedDay.numberOfFreeAppointments + 1;
  if (newAppointmentsCounter <= provider.serviceProvider.ratePerHour) {
    await Days.findByIdAndUpdate(day, {
      numberOfFreeAppointments: newAppointmentsCounter,
    });
  }
  await appointment.findOneAndDelete({ day, serviceProvider, user });

  res.status(200).json({ status: "success" });
});

exports.deleteDays = catchAsync(async (req, res, next) => {
  await Days.deleteMany();
  res.status(200).json({});
});

exports.deleteAppointments = catchAsync(async (req, res, next) => {
  await appointment.deleteMany();
  res.status(200).json({});
});
