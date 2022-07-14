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
    type: String,
  },
  longitude: {
    type: String,
  },
  distance: {
    type: Number,
  },
});

const Hotel = mongoose.model("Hotel", hotelsSchema);
module.exports = Hotel;
