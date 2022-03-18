const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema(
    {
        vaccineName: {
            type: String,
            required: [true, "Please tell us the vaccinename!"],
          },
          vaccineDescription: {
            type: String,
            required: [true, "Please tell us the vaccine description!"],
          },
          vaccineDate: {
              type: String,
              required: [true, "Please tell us the vaccine Date!"]
          },
          required: {
              type: Boolean,
              required: [true, "Please tell us if its required or optional!"]
          }

    }
);
const Vaccine = mongoose.model("Vaccine", vaccineSchema);
module.exports = Vaccine;