const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Pet Carer", "Vet", "Trainer"],
    required: [true, "service provider must have a type"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  workingHours: {
    startingHour: {
      type: Number,
      required: [true, "working hours required"],
    },
    finishingHour: {
      type: Number,
      required: [true, "working hours required"],
    },
  },
  offDays: [
    {
      type: String,
      enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
  ],
  ratePerHour: {
    type: Number,
    default: 0,
  },
  landLine: {
    type: String,
  },
  verificationDocuments: [
    {
      type: String,
    },
  ],
});

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);

module.exports = ServiceProvider;
