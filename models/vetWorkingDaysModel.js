const mongoose = require("mongoose");
// const User = require("./userModel");
const vetWorkingDaysSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  workingDays: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "workingDays",
    },
  ],
});

const VetWorkingDays = mongoose.model("VetWorkingDays", vetWorkingDaysSchema);
module.exports = VetWorkingDays;
