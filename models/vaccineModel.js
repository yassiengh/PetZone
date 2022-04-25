const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: [true, "Please tell us the vaccine name!"],
  },
  vaccineDescription: {
    type: String,
    required: [true, "Please tell us the vaccine description!"],
  },

  required: {
    type: Boolean,
    required: [true, "Please tell us if its required or optional!"],
  },
  recurring: {
    type: Boolean,
    required: [true, "Please tell us if its recurring or not"],
  },
  recurringEvery: {
    type: Number,
  },
  forPets: {
    type: String,
    required: [true, "Please tell us which type of pets is this vaccine for"],
  },
});
const Vaccine = mongoose.model("Vaccine", vaccineSchema);
module.exports = Vaccine;
