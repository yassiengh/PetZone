const mongoose = require("mongoose");
const User = require("./userModel");

const forumsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A post must have a Title!"],
  },
  picture: {
    type: String,
    default:
      "https://res.cloudinary.com/petzone/image/upload/v1658209944/forums/injureddefaultjpg.png",
  },
  text: {
    type: String,
    required: [true, "A post must have Text"],
  },
  categories: {
    type: [
      {
        type: String,
      },
    ],
    required: [true, "A post must have a category"],
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  upvoters: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  downvotes: {
    type: Number,
    defualt: 0,
  },
  downvoters: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      text: {
        type: String,
      },
      owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
});

forumsSchema.pre("save", async function (next) {
  const info = await User.findById(this.owner);
  this.owner = info;
  next();
});

const Forums = mongoose.model("Forums", forumsSchema);

module.exports = Forums;
