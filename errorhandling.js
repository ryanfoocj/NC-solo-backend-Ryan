const express = require("express");
const app = express();

exports.errorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handler404 = (req, res) => {
  res.status(404).send({ msg: "404: Route Not Found!" });
};

exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400: Bad Request!" });
  } else {
    next(err);
  }
};

exports.internalErrorHandler = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "500: Internal Server Error" });
  }
};
