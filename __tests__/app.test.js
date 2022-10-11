const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  describe("/api", () => {
    describe("GET: /api/topics", () => {
      test("200 should respond with an array of topic objects that match test data ", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body)).toBe(true);
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
            expect(msg).toBe("404 Route Not Found!");
          });
      });
    });
  });
});

describe("app", () => {
  describe("/api", () => {
    describe("GET: /api/articles/:article_id", () => {
      test("200: should return an article that matches test data", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((response) => {
            expect(response.body.length).toBe(1);
            const article = response.body[0];
            expect(Array.isArray(article)).toBe(false);
            expect(typeof article).toBe("object");
            expect(article).toEqual({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            });
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
            expect(msg).toBe("400 Bad Request!");
          });
      });
      test("404: non existent resource should return appropriate message", () => {
        return request(app)
          .get("/api/articles/99999")
          .expect(404)
          .then((response) => {
            const {
              body: { msg },
            } = response;
            expect(msg).toBe("No article found for article_id: 99999");
          });
      });
    });
  });
});

/* describe("app", () => {
  describe("/api", () => {
    describe("PATCH: /api/articles/:article_id", () => {
      test("should return an article object with updated data", () => {
        const newVote = { inc_votes: 50 };
        return request(app)
          .patch("/api/articles/2")
          .send(newVote)
          .expect(200)
          .then((response) => {
            expect(response.body.length).toBe(1);
            const article = response[0];
            expect(Array.isArray(article)).toBe(false);
            expect(typeof article).toBe("object");
          });
      });
    });
  });
}); */
