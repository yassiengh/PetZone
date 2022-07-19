const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const forums = require("../models/forumsModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

cloudinary.config({
  cloud_name: "petzone",
  api_key: "665311693884718",
  api_secret: "ZkkQgzfKk4kcfeKVRkvZ3I8RpBw",
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const multerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    use_filename: true,
    filename_override: function (req) {
      return `forums-${req.user.id}-${new Date().getTime().toString()}`;
    },
    folder: "forums",
    unique_filename: false,
  },
});

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadForumPhoto = upload.single("photo");

exports.createPost = catchAsync(async (req, res, next) => {
  let cat = JSON.parse(req.body.categories);
  req.body.categories = cat;
  if (req.file) {
    req.body.picture = req.file.path;
  }
  const newPost = await forums.create(req.body);

  res.status(200).json({
    status: "success",
    data: { newPost },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await forums
    .findById(req.params.id)
    .populate("owner")
    .populate("comments.owner");

  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    forums.find().populate("owner").populate("comments.owner"),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;

  res.status(200).json({
    status: "success",
    data: posts,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await forums.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.updateLikeCounter = catchAsync(async (req, res, next) => {
  let post = await forums.findById(req.query.id);

  if (post.upvoters.includes(req.body.upvoterID))
    return next(new AppError("User already upvoted this post", 404));
  if (post.downvoters.includes(req.body.upvoterID))
    return next(new AppError("cant upvote and downvote the same post", 404));

  post.upvotes = post.upvotes + 1;
  let array = post.upvoters;
  array.push(req.body.upvoterID);
  post.upvoters = array;
  await forums.findByIdAndUpdate(req.query.id, post);

  res.status(200).json({});
});

exports.removeLike = catchAsync(async (req, res, next) => {
  let post = await forums.findById(req.query.id);
  if (post.upvotes > 0) post.upvotes = post.upvotes - 1;

  post.upvoters = post.upvoters.filter((voter) => voter != req.body.userID);
  await forums.findByIdAndUpdate(req.query.id, post);

  res.status(200).json({});
});

exports.updateDislikeCounter = catchAsync(async (req, res, next) => {
  let post = await forums.findById(req.query.id);

  if (post.downvoters.includes(req.body.downvoterID))
    return next(new AppError("User already downvoted this post", 404));
  if (post.upvoters.includes(req.body.downvoterID))
    return next(new AppError("cant upvote and downvote the same post", 404));

  post.downvotes = post.downvotes + 1;
  let array = post.downvoters;
  array.push(req.body.downvoterID);
  post.downvoters = array;
  await forums.findByIdAndUpdate(req.query.id, post);

  res.status(200).json({});
});

exports.removeDislike = catchAsync(async (req, res, next) => {
  let post = await forums.findById(req.query.id);
  if (post.downvotes > 0) post.downvotes = post.downvotes - 1;

  post.downvoters = post.downvoters.filter((voter) => voter != req.body.userID);
  await forums.findByIdAndUpdate(req.query.id, post);

  res.status(200).json({});
});

exports.deletePost = catchAsync(async (req, res, next) => {
  await forums.findByIdAndDelete(req.params.id);

  res.status(200).json({});
});

exports.addComment = catchAsync(async (req, res, next) => {
  let post = await forums.findById(req.body.postID);
  let comment = {};
  comment.text = req.body.commentText;
  comment.owner = req.body.commentOwner;
  let array = post.comments;
  array.push(comment);
  post.comments = array;
  await forums.findByIdAndUpdate(req.body.postID, post);

  res.status(200).json({});
});

exports.getReports = catchAsync(async (req, res, next) => {
  let reports = await forums.find().populate("owner");
  reports = reports.filter((report) => report.categories.includes("report"));

  res.status(200).json({ reports });
});
