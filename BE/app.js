const express = require("express");
const app = express();

const bodyparser = require("body-parser");
// Environment file set
const dotnet = require("dotenv");
dotnet.config({ path: "./config/config.env" });
const cors = require("cors");
app.use(express.json({ limit: "8mb" }));
let cookieParser = require("cookie-parser");
app.use(cookieParser());
//

const cron = require("node-cron");
let ALLOWED_ORIGINS = [
  "https://fe-two-opal.vercel.app",
  "https://www.artisanuw.com.au",
  "https://artisanuw.com.au",
  "https://artisan-academy.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use((req, res, next) => {
  let origin = req.headers.origin;
  let theOrigin =
    ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];

  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

cron.schedule("*/10 * * * *", () => {
  try {
    // Your code to be executed every 15 minutes
    console.log("Cron job executed every 15 minutes");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
//
// app.use(
//   cors({
//     origin: process.env.CORS,

//     credentials: true,
//     exposedHeaders: ["Set-Cookie"],
//   })
// );
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// All Routes
const user = require("./routes/userRoute");
const course = require("./routes/courseRoute");
const videos = require("./routes/videoRoute");
const quiz = require("./routes/quizRoute");
const profile = require("./routes/profileRoute");
const enrollment = require("./routes/enrollmentRoute");
app.use("/api/v1", user);
app.use("/api/v1", course);
app.use("/api/v1", videos);
app.use("/api/v1", quiz);
app.use("/api/v1", enrollment);
app.use("/api/v1", profile);

module.exports = app;
