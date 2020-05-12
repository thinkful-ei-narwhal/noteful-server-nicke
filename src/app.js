const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const { NODE_ENV, API_TOKEN } = require("./config");
const morganOption = (NODE_ENV === "production") ? "tiny" : "common";

app.use(morgan("default"));
app.use(cors());
app.use(helmet());
app.use(morgan(morganOption));

const noteRouter = require("./notes-route");
const folderRouter = require("./folders-route");
app.use(function requireAuth(req, res, next) {
  const authValue = req.get("Authorization");

  //verify bearer
  if (!authValue.toLowerCase().startsWith("bearer")) {
    return res.status(400).json({ error: "Missing bearer token" });
  }

  const token = authValue.split(" ")[1];

  if (token !== API_TOKEN) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
});

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.use("/notes", noteRouter);
app.use("/folders", folderRouter);




app.get("/", (req, res) => {
  res.send("Hello, boilerplate!");
});

module.exports = app;
