const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const response = require("express");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app", () => {
  describe("/api", () => {
    describe("GET: /api/topics", () => {
      test("200 should respond with an array of topic objects ", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            response.body.forEach((topic) => {
              expect(typeof topic).toBe("object");
              expect(Array.isArray(topic)).toBe(false);
            });
          });
      });
      test("200 array of topic objects should have slug and description properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            response.body.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
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
