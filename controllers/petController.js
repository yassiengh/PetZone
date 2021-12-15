const Pet = require('../models/petModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAllPets = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Pet.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const pets = await features.query;
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: pets.length,
      data: {
        pets
      }
    });
});

exports.getPet = catchAsync(async (req, res, next) => {
    const pet = await Pet.findById(req.params.id);
  
    if (!pet) {
      return next(new AppError('No pet found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        pet
      }
    });
});

exports.createPet = catchAsync(async (req, res, next) => {
    const newPet = await Pet.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        pet: newPet
      }
    });
});

exports.updatePet = catchAsync(async (req, res, next) => {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!pet) {
      return next(new AppError('No pet found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        pet
      }
    });
});

exports.deletePet = catchAsync(async (req, res, next) => {
    const pet = await Pet.findByIdAndDelete(req.params.id);
  
    if (!pet) {
      return next(new AppError('No pet found with that ID', 404));
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });


