const mongoose = require("mongoose");

const hotelsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  imageURL: {
    type: String,
    default: "default.jpg",
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  distance: {
    type: Number,
  },
});

const Hotel = mongoose.model("Hotel", hotelsSchema);
module.exports = Hotel;
