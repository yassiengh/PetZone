const mongoose = require("mongoose");
// const User = require("./userModel");
const vetWorkingDaysSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  workingDays: [
    {
      date: {
        type: String,
      },
      numberOfFreeAppointments: {
        type: Number,
      },
    },
  ],
});

const VetWorkingDays = mongoose.model("VetWorkingDays", vetWorkingDaysSchema);
module.exports = VetWorkingDays;
