const express = require("express");
const forumsController = require("../controllers/forumsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/updateLikeCounter").patch(forumsController.updateLikeCounter);
router.route("/removelike").patch(forumsController.removeLike);
router
  .route("/updatedislikeCounter")
  .patch(forumsController.updateDislikeCounter);
router.route("/removedislike").patch(forumsController.removeDislike);
router.route("/addComment").patch(forumsController.addComment);
router.route("/reports").get(forumsController.getReports);

router
  .route("/")
  .post(
    authController.protect,
    forumsController.uploadForumPhoto,
    forumsController.createPost
  )
  .get(forumsController.getAllPosts);

router
  .route("/:id")
  .get(forumsController.getPost)
  .patch(forumsController.updatePost)
  .delete(forumsController.deletePost);

module.exports = router;
