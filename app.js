const express = require("express");
const app = express();
const {
  errorHandler,
  psqlErrorHandler,
  handler404,
  handlesInternalError,
} = require("./errorhandling");
const {
  getTopics,
  getArticleById,
  patchArticleById,
} = require("./controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.all("/api/*", handler404);
app.use(errorHandler);
app.use(psqlErrorHandler);
app.use(handlesInternalError);

module.exports = app;
