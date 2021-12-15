const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({

    petName:{
    type: String,
    required: [true, "Please tell us your Pet Name!"],
    },
    petType:{
        type: String,
        required: [true, "Please tell us your Pet Type!"],
    },
    petBreed:{
        type: String,
        required: [true, "Please tell us your Pet Breed!"],
    },
    petGender:{
        type: String,
        required: [true, "Please tell us your Pet Gender!"],
    },
    petage:{
        type: String,
        required: [true, "Please tell us your Pet age!"],
    },
    petWeight:{
        type: String,
        required: [true, "Please tell us your Pet Weight!"],
    },
    petColor:{
        type: String,
        required: [true, "Please tell us your Pet color!"],
    },
    petDescription:{
        type: String,
        required: [true, "Please tell us your Pet Description!"],
    },
    petProfilePic:String,
    petPassport: String,
    petHealthCerificate:String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }

);




const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;


