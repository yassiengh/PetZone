const forums = require("../models/forumsModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await forums.create(req.body);
  res.status(200).json({
    status: "success",
    data: { newPost },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await forums.findById(req.params.id).populate("owner");
  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(forums.find().populate("owner"), req.query)
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
  console.log(post);
  post.upvotes = post.upvotes + 1;
  let array = post.upvoters;
  array.push(req.body.upvoterID);
  post.upvoters = array;
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
  let reports = await forums.find();
  reports = reports.filter((report) => report.categories.includes("report"));
  res.status(200).json({ reports });
});
