const express = require("express");
const app = express();
const {
  clientErrorHandler,
  psqlErrorHandler,
  handler404,
  handlesInternalErr,
} = require("./errors");
const { getTopics, getArticleById } = require("./controllers");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/api/*", handler404);
app.use(clientErrorHandler);
app.use(psqlErrorHandler);
app.use(handlesInternalErr);

module.exports = app;
