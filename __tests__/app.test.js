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
});

/* describe.only("GET: /api/articles/:article_id/comments should return an array of comments ordered by recency", () => {
  test("should return an array of comments ordered by recency", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments).toBe([]);
      });
  });
}); */

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

  test("400: should handle a request that contains a votes key without a number ", () => {
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
});

describe("GET: /api/articles should return an array of article objects sorted by recency and takes a topic query", () => {
  test("200: should return an array of objects that are sorted by recency ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
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
  test("returns empty array if topic exists but has no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });
});
