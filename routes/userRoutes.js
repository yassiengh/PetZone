const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const bookingController = require("./../controllers/bookingController");
const ratingsController = require("./../controllers/ratingsController");

const router = express.Router();

router.post(
  "/signup",
  userController.uploadUserPhotoSignup,
  authController.signup
);
router.post("/login", authController.login);
router.post("/logout", authController.protect, authController.logout);
router.post("/VerifyToken/:token", authController.VerifyToken);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyEmail", authController.verifyEmail);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/emailVerfication/:token", authController.emailVerfication);

router.patch(
  "/updateMyPassword/",
  authController.protect,
  authController.updatePassword
);

router.get("/loadserviceProvider/:id", bookingController.loadServiceProvider);

router.post(
  "/userByDistance",
  userController.getAllSortedServiceProvidersByDistance
);
router
  .route("/vets")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllVets
  );
router
  .route("/appointments/:id")
  .get(authController.protect, userController.getAllProviderAppointments);
router.get("/me", authController.protect, userController.getMe);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.updateMe
);

router
  .route("/rate")
  .post(authController.restrictTo("pet owner"), ratingsController.rateProvider);

router.delete("/deleteMe", authController.protect, userController.deleteMe);
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );
router.route("/:id").get(userController.getUser);

module.exports = router;
