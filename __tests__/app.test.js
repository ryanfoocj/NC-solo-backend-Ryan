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

/* describe("app", () => {
  describe("/api", () => {
    describe("GET: /api/articles/:article_id", () => {
      describe("200: should return an array of objects", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response)).toBe(true);
            response.body.forEach((article) => {
              expect(typeof topic).toBe("object");
              expect(Array.isArray(topic)).toBe(false);
            });
          });
      });
    });
  });
}); */
