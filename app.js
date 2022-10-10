const express = require("express");
const app = express();
const { getTopics } = require("./controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "500 Internal Server Error" });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "404 Route Not Found!" });
});

module.exports = app;
