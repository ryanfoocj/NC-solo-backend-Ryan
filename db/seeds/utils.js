const db = require("../connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkExists = async (table, params, value) => {
  if (!table || !params || !value) {
    return Promise.reject({ status: 400, msg: "400: Request is missing info" });
  }
  const queryStr = format("SELECT * FROM %I WHERE %I = $1", table, params);
  const dbResult = await db.query(queryStr, [value]);

  if (dbResult.rows.length === 0) {
    let message = "";
    switch (table) {
      case "articles":
        message = "404: Article not found";
        break;
      case "users":
        message = "404: User not found";
        break;
      case "topics":
        message = "404: Topic not found";
        break;
    }
    return Promise.reject({ status: 404, msg: message });
  }
};

exports.checkColumnExists = async (column, table) => {
  const queryStr = format("SELECT %I FROM %I;", column, table);

  return await db.query(queryStr);
};
