const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET: /api/topics should return an array of topic objects", () => {
  test("200 should respond with an array of topic objects that match test data ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(3);
        response.body.forEach((topic) => {
          expect(typeof topic).toBe("object");
          expect(Array.isArray(topic)).toBe(false);
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404 if there is a reference error or typo in endpoint, handles error and returns message ", () => {
    return request(app)
      .get("/api/topical")
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("404: Route Not Found!");
      });
  });
});

describe("GET: /api/articles/:article_id should return an article corresponding to id parameter", () => {
  test("200: should return an article that matches test data, including the joined comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(1);
        const article = response.body[0];
        expect(Array.isArray(article)).toBe(false);
        expect(typeof article).toBe("object");
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: expect.any(String),
            created_at: expect.any(String),
            comment_count: 11,
            votes: 100,
          })
        );
      });
  });
  test("200: article with 0 comments should still return a comment count", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(1);
        const article = response.body[0];
        expect(Array.isArray(article)).toBe(false);
        expect(typeof article).toBe("object");
        expect(article).toEqual(
          expect.objectContaining({
            comment_count: 0,
          })
        );
      });
  });
  test("400: should handle a bad request and return appropriate message", () => {
    return request(app)
      .get("/api/articles/bird")
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400: Bad Request!");
      });
  });

  test("404: returns an error if article does not exist", () => {
    return request(app)
      .get("/api/articles/7000")
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("404: Article not found");
      });
  });
});

describe("GET: /api/articles/:article_id/comments should return an array of comments ordered by recency", () => {
  test("200: should return an array of comments ordered by recency", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments.length).toBe(2);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: an article without comments should return an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });
  test("404: request for an article that does not exist should return error message", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toEqual("404: Article not found");
      });
  });
});

describe("GET: /api/users should return an array of all users", () => {
  test("200: should return an array of objects containing users that match test data", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(4);
        response.body.forEach((user) => {
          expect(Array.isArray(user)).toBe(false);
          expect(typeof user).toBe("object");
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("PATCH: /api/articles/:article_id should update corresponding article with new data", () => {
  test("200: should return an article object with updated data", () => {
    const newVote = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(200)
      .then((response) => {
        const article = response.body;
        expect(Array.isArray(article)).toBe(false);
        expect(typeof article).toBe("object");
        expect(article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: expect.any(String),
          votes: 50,
        });
      });
  });
  test("400: should handle a request that doesn't contain inc_votes key and return error message ", () => {
    const newVote = { votes_inc: 10 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400 Bad Request: no votes found!");
      });
  });

  test("400: request for an article that does not exist should return error message ", () => {
    const newVote = { inc_votes: "apple" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400 Bad Request: votes have to be a number");
      });
  });

  test("404: request for an article that does not exist should return error message ", () => {
    const newVote = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/1000")
      .send(newVote)
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("404: Article not found");
      });
  });
});

describe("GET: /api/articles should return an array of article objects sorted by descending date and takes a topic query", () => {
  test("200: should return an array of objects that are sorted by date in descending order by default ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(Number),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: should accept an optional topic query which filters out articles unrelated to topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.length).toBe(1);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "cats",
            })
          );
        });
      });
  });
  test("404: returns error if topic query does not exist", () => {
    return request(app)
      .get("/api/articles?topic=fish")
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("404: Topic not found");
      });
  });

  test("200: should return an empty array if topic exists but no article related to it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });
  test("200: should return an array of objects that are sorted by a query ", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.length).toBe(11);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("200: should return an array of objects that are sorted by a query and order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles.length).toBe(11);
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });

  test("400: should return a bad request if sort_by column doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=chicken&order=asc")
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400: Column not found");
      });
  });

  test("400: should return a bad request if order query is invalid", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order=potato")
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400: Order is invalid");
      });
  });
});

describe("POST /api/articles/:article_id/comments should create a comment and add it to database", () => {
  test("201: should create a new comment object, add it to comments db and respond with the comment", () => {
    const newComment = {
      username: "lurker",
      body: "OMG FIRST COMMENT",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            author: "lurker",
            body: "OMG FIRST COMMENT",
            votes: 0,
          })
        );
      });
  });

  test("400: request without body property or is an empty comment should return bad request", () => {
    const newComment = {
      username: "lurker",
      body: "",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400: Comment is empty");
      });
  });

  test("400: request without username property should return bad request", () => {
    const newComment = {
      user: "lurker",
      body: "Hehehe",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("400: Request is missing info");
      });
  });

  test("404: request with a non-existent username ", () => {
    const newComment = {
      username: "randomMan",
      body: "Hello hello hello",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("404: User not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id should delete a comment from database and return to user", () => {
  test("202 comment is deleted from database and returned as a response object", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });

  test("404 if comment_id cannot be found ", () => {
    return request(app)
      .delete("/api/comments/9000")
      .expect(404)
      .then((response) => {
        const {
          body: { msg },
        } = response;
        expect(msg).toBe("404: Comment not found");
      });
  });
});
