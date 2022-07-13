const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");

const router = express.Router();

router
  .route("/verifynationalID/:id")
  .patch(adminDashboardController.verifyUserNationalID);

router
  .route("/verifyNationalID")
  .get(adminDashboardController.getAllUsersWaitingForIDVerification);

router
  .route("/userReports/banUser/:id")
  .patch(adminDashboardController.banAccountUsingId);

router
  .route("/userReports/:id")
  .get(adminDashboardController.getReport)
  .patch(adminDashboardController.banAccountUsingReport);

router
  .route("/userReports")
  .get(adminDashboardController.getUserReports)
  .post(adminDashboardController.createUserReport);

module.exports = router;
