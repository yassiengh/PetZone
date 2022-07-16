const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  serviceProvider: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
});

const ratings = mongoose.model("ratings", ratingsSchema);

module.exports = ratings;
