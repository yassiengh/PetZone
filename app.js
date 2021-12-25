const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const userRouter = require("./routes/userRoutes");
const petRouter = require("./routes/petRoutes");
const petAdouptionRouter = require("./routes/petAdoptionRoutes");
const petOfferAdouptionRouter = require("./routes/offerAdoption");
const petBreedingRouter = require("./routes/petBreedingRoutes");
const petOfferBreedingRouter = require("./routes/offerBreeding");

const app = express();

//1) Global middelwares

//set securety HTTP headers
app.use(helmet());

//Devolpment logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests from the same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: [
      "petType",
      "petBreed",
      "petGender",
      "petage",
      "petWeight",
      "petColor",
    ],
  })
);

// Serving static files
//app.use(express.static(`${__dirname}/public`))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
  next();
});

// routes

app.use("/api/v1/pets", petRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/adopt", petAdouptionRouter);
app.use("/api/v1/offerAdoption", petOfferAdouptionRouter);
app.use("/api/v1/breeding", petBreedingRouter);
app.use("/api/v1/offerBreeding", petOfferBreedingRouter);

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;
