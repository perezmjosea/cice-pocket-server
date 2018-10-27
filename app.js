require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const chalk = require("chalk");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const websitesRouter = require("./routes/websites");
const PORT = process.env.PORT || 3003;
const DB_NAME = process.env.DB_NAME || "cicepocket";
const DB_URL = `mongodb://${process.env.DB_URL || "localhost:27017"}`;
// const DB_URL = `mongodb://${process.env.DB_URL || "localhost:27018"}`;
// const DB_URL = `mongodb://${process.env.DB_URL || "192.168.0.175:27017"}`;

const app = express();

const log = console.log;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Seteo el router de websites
app.use("/website", websitesRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("Error");
});

app.listen(PORT, () => {
  log(chalk.cyan(`Server up at ${PORT}`));

  MongoClient.connect(
    DB_URL,
    function(err, client) {
      if (err) throw err;

      log(chalk.cyan(`MongoDB up at ${DB_URL}`));

      const db = client.db(DB_NAME);

      websitesRouter.setMongoClient(db);
    }
  );
});

module.exports = app;
