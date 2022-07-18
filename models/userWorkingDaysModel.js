const mongoose = require("mongoose");
// const User = require("./userModel");
const userWorkingDaysSchema = new mongoose.Schema({
  serviceProvider: {
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

const userWorkingDays = mongoose.model(
  "userWorkingDays",
  userWorkingDaysSchema
);
module.exports = userWorkingDays;
