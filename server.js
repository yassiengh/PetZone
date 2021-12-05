const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    userFindAndModify: true,
  })
  .then((con) => {
    console.log(con);
  });

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
