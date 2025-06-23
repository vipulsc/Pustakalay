const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./index");

describe("API Server Basic Tests", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return Backend is Running on GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Backend is Running");
  });
});

describe("User API", () => {
  let token;
  let userId;
  const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "testpass123",
    address: "123 Test Lane",
  };

  afterAll(async () => {
    // Clean up test user
    const User = require("./db/models/user");
    await User.deleteOne({ email: testUser.email });
    await mongoose.connection.close();
  });

  it("should signup a new user", async () => {
    const res = await request(app).post("/api/v1/signup").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("username", testUser.username);
    token = res.body.token;
    userId = res.body.user.id;
  });

  it("should not signup with existing email", async () => {
    const res = await request(app).post("/api/v1/signup").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already registered|already taken/);
  });

  it("should signin with correct credentials", async () => {
    const res = await request(app).post("/api/v1/signin").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("should not signin with wrong password", async () => {
    const res = await request(app).post("/api/v1/signin").send({
      email: testUser.email,
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid email or password/);
  });
});
