const catchAsync = require("../utils/catchAsync");
const Hotels = require("../models/hotelsModel");
const reader = require("xlsx");
const distanceCalculator = require("./../utils/distanceCalculator");

exports.importHotelFromXLSX = catchAsync(async (req, res, next) => {
  const file = reader.readFile("hotel.xlsx");
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  console.log(temp, temp.length);
  temp.forEach(async (hotel) => {
    let object = {
      title: hotel.title,
      rating: hotel.rating,
      imageURL: hotel.imgUrl,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    };
    await Hotels.create(object);
  });

  res.status(200).json({});
});

exports.getHotelsSortedByDistance = catchAsync(async (req, res, next) => {
  let hotels = await Hotels.find();
  const userLat = req.body.latitude;
  const userLong = req.body.longitude;
  hotels.forEach((hotel) => {
    let d = distanceCalculator(
      userLat,
      userLong,
      hotel.latitude,
      hotel.longitude
    );
    hotel["distance"] = d;
  });

  hotels.sort((a, b) => {
    return a.distance - b.distance;
  });

  res.status(200).json({ hotels });
});
