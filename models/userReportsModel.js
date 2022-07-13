const mongoose = require("mongoose");

const userReportsSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  reported: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  offence: {
    type: String,
    required: true,
  },
  reportDescription: {
    type: String,
  },
});

const userReports = mongoose.model("userReports", userReportsSchema);

module.exports = userReports;
