const mongoose = require("mongoose");
const User = require("./userModel");

const appointmentsSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  day: {
    type: mongoose.Schema.ObjectId,
    ref: "VetWorkingDays",
  },
});

const Appointments = mongoose.model("Appointments", appointmentsSchema);

module.exports = Appointments;
