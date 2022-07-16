const mongoose = require("mongoose");

const workingDaysSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  numberOfFreeAppointments: {
    type: Number,
  },
});

const workingDays = mongoose.model("workingDays", workingDaysSchema);
module.exports = workingDays;
