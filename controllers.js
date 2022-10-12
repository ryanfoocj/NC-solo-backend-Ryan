const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  updateArticle,
  fetchUsers,
} = require("./models");
const { checkTopicExists, checkArticleExists } = require("./db/seeds/utils");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  if (req.query.topic) {
    const topic = req.query.topic;
    const promises = [checkTopicExists(topic), fetchArticles(topic)];
    Promise.all(promises)
      .then((response) => {
        const articles = response[1];
        res.status(200).send(articles);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchArticles().then((articles) => {
      res.status(200).send(articles);
    });
  }
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      fetchArticleById(article_id).then((article) => {
        res.status(200).send([article]);
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      fetchArticleComments(article_id).then((comments) => {
        res.status(200).send(comments);
      });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [
    checkArticleExists(article_id),
    updateArticle(article_id, inc_votes),
  ];
  Promise.all(promises)
    .then((response) => {
      res.status(200).send(response[1]);
    })
    .catch((err) => {
      next(err);
    });
};
