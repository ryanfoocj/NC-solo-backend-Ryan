const express = require("express");
const app = express();
const {
  errorHandler,
  psqlErrorHandler,
  handler404,
  internalErrorHandler,
} = require("./errorhandling");
const {
  getTopics,
  getArticles,
  getArticleById,
  getUsers,
  patchArticleById,
} = require("./controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("/api/*", handler404);
app.use(errorHandler);
app.use(psqlErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
