const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");
const { errorMessage } = require("./utils/message");
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json(errorMessage("Route not found"));
});

app.use((error, req, res, next) => {
  res.status(500).json(errorMessage("Something went wrong!"));
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = app;
