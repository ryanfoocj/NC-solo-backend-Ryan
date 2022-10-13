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
  getArticleComments,
  getUsers,
  patchArticleById,
  postComment,
  deleteComment,
} = require("./controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("/api/*", handler404);
app.use(errorHandler);
app.use(psqlErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
