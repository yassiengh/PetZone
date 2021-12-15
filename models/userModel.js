const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please tell us your username!"],
  },
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  profilePicture: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // work on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same!",
    },
  },
  nationalID: {
    type: String,
    select: false,
  },
  country: {
    type: String,
    required: [true, "Please confirm your country"],
    lowercase: true,
  },
  address: {
    type: String,
    required: [true, "Please confirm your address"],
    lowercase: true,
  },
  city: {
    type: String,
    required: [true, "Please confirm your city"],
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide a Phone number"],
  },
  role: {
    type: String,
    enum: ["pet owner", "service provider", "admin"],
  },
  POA: {
    numberOfPets: {
      type: Number,
      default: 0,
    },
    childPet: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Pet",
      },
    ],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerifyToken: String,
  emailVerifyExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
    select: false,
  }
  
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// /^find/ ---> looking for string that start with find
userSchema.pre(/^find/, function (next) {
  //point to the current query
  this.find({ active: { $ne: false } });
  next()
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerifyToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  this.emailVerifyToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  console.log({ verifyToken }, this.emailVerifyToken);

  this.emailVerifyExpires = Date.now() + 10 * 60 * 1000;

  return verifyToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
