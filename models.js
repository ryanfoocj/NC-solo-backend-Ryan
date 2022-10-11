const db = require("./db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) ::int AS comment_count FROM articles 
      JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${id}`,
        });
      }
      return article;
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: users }) => {
    return users;
  });
};

exports.updateArticle = (id, votes) => {
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: "400 Bad Request: no votes found!",
    });
  }
  if (typeof votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "400 Bad Request: votes have to be a number",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [id, votes]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
