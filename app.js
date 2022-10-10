const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/api/*", (req, res) => {
  res.status(404).send({ msg: "404 Route Not Found!" });
});

app.use((err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "500 Internal Server Error" });
  }
});

module.exports = app;
