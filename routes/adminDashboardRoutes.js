const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");
const authController = require("../controllers/authController");
const router = express.Router();

router
  .route("/verifynationalID/:id")
  .patch(
    authController.protect,authController.restrictTo("admin"),adminDashboardController.verifyUserNationalID);

router
  .route("/verifyNationalID")
  .get(authController.protect,authController.restrictTo("admin"),adminDashboardController.getAllUsersWaitingForIDVerification);

router
  .route("/userReports/banUser/:id")
  .patch(authController.protect,authController.restrictTo("admin"),adminDashboardController.banAccountUsingId);

router
  .route("/userReports/:id")
  .get(authController.protect,authController.restrictTo("admin"),adminDashboardController.getReport)
  .patch(authController.restrictTo("admin"),adminDashboardController.banAccountUsingReport);

router
  .route("/userReports")
  .get(authController.protect,authController.restrictTo("admin"),adminDashboardController.getUserReports)
  .post(adminDashboardController.createUserReport);

module.exports = router;
