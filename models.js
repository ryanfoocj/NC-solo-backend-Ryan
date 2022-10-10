const db = require("./db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (id) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1");
};
