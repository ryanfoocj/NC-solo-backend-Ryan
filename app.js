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
  getUsers,
  patchArticleById,
} = require("./controllers");
const articles = require("./db/data/test-data/articles");
const comments = require("./db/data/test-data/comments");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("/api/*", handler404);
app.use(errorHandler);
app.use(psqlErrorHandler);
app.use(handlesInternalError);

module.exports = app;

//SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = 1 GROUP BY articles.article_id;
