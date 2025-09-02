const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes/index");

app.use(express.json());
app.use(cors());

app.use("/api", routes);

module.exports = app;