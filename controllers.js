const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  updateArticle,
  fetchUsers,
  createComment,
} = require("./models");
const { checkExists, checkColumnExists } = require("./db/seeds/utils");

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
  if (Object.keys(req.query).length > 0) {
    const promises = [
      checkExists("topics", "slug", req.query.topic),
      fetchArticles(req.query),
    ];

    if (req.query.sort_by) {
      promises.push(checkColumnExists(req.query.sort_by, "articles"));
    }
    Promise.all(promises)
      .then((response) => {
        const articles = response[1];
        res.status(200).send(articles);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchArticles(req.query).then((articles) => {
      res.status(200).send(articles);
    });
  }
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  checkExists("articles", "article_id", article_id)
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
  checkExists("articles", "article_id", article_id)
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
    checkExists("articles", "article_id", article_id),
    updateArticle(article_id, inc_votes),
  ];
  Promise.all(promises)
    .then((response) => {
      res.status(200).send(response[1]);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { username } = req.body;
  const { body } = req.body;
  const { article_id } = req.params;

  checkExists("users", "username", username)
    .then(() => {
      if (body === "" || !body) {
        return Promise.reject({ status: 400, msg: "400: Comment is empty" });
      }
    })
    .then(() => {
      createComment(username, body, article_id).then((comment) => {
        res.status(201).send(comment);
      });
    })
    .catch(next);
};
