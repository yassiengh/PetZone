const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: [true, "Please tell us your Pet Name!"],
    },
    petType: {
      type: String,
      required: [true, "Please tell us your Pet Type!"],
    },
    petBreed: {
      type: String,
      required: [true, "Please tell us your Pet Breed!"],
    },
    petGender: {
      type: String,
      required: [true, "Please tell us your Pet Gender!"],
    },
    petage: {
      type: String,
      required: [true, "Please tell us your Pet age!"],
    },
    petWeight: {
      type: String,
      required: [true, "Please tell us your Pet Weight!"],
    },
    petColor: {
      type: String,
      required: [true, "Please tell us your Pet color!"],
    },
    petDescription: {
      type: String,
      required: [true, "Please tell us your Pet Description!"],
    },
    petProfilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/petzone/image/upload/v1657886693/pets/default.jpg",
    },
    petPassport: String,
    petHealthCerificate: String,
    adopted: {
      type: Boolean,
      default: false,
    },
    offerAdoption: {
      type: Boolean,
      default: false,
    },
    breeding: {
      type: Boolean,
      default: false,
    },
    offerBreeding: {
      type: Boolean,
      default: false,
    },
    checkedVaccines: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        vaccine: {
          type: mongoose.Schema.ObjectId,
          ref: "Vaccine",
        },
        lastTimeTaken: {
          type: String,
          default: 0,
        },
      },
    ],
    desiredVaccines: [
      {
        vaccine: {
          type: mongoose.Schema.ObjectId,
          ref: "Vaccine",
        },
        timeRemaining: {
          type: String,
          default: 0,
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Pet = mongoose.model("Pet", petSchema);
module.exports = Pet;
