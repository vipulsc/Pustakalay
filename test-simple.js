const request = require("supertest");
const app = require("./index");

describe("Basic API Tests", () => {
  test("GET / - Should return health check message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Backend is Running");
  }, 10000);

  test("GET /api/v1/allbooks - Should return books array", async () => {
    const response = await request(app).get("/api/v1/allbooks");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("books");
    expect(Array.isArray(response.body.books)).toBe(true);
  }, 10000);
});
