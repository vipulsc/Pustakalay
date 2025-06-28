const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./index");
const User = require("./db/models/user");
const Book = require("./db/models/books");

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.MONGO_URL = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-secret-key-for-jwt-signing";

let authToken;
let adminToken;
let testBookId;
let testUserId;

// Test user data
const testUser = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
  address: "123 Test Street",
};

describe("Kitaabi Kidaa API Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    try {
      await mongoose.connect(
        process.env.MONGO_URL || "mongodb://localhost:27017/test"
      );
    } catch (error) {
      console.error("Database connection error:", error.message);
    }
  }, 30000);

  afterAll(async () => {
    try {
      // Clean up all test data
      await User.deleteMany({});
      await Book.deleteMany({});
      // Close connection
      await mongoose.connection.close();
    } catch (error) {
      console.error("Cleanup error:", error.message);
    }
  }, 10000);

  beforeEach(async () => {
    // Clear test data before each test
    try {
      await User.deleteMany({});
      await Book.deleteMany({});
    } catch (error) {
      console.log("Database cleanup error:", error.message);
    }
  });

  describe("Health Check", () => {
    test("GET / - Should return health check message", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.text).toBe("Backend is Running");
    }, 10000);
  });

  describe("Authentication", () => {
    test("POST /api/v1/signup - Should create a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        address: "123 Test Street",
      };

      const response = await request(app).post("/api/v1/signup").send(userData);

      // Log response for debugging
      console.log("Signup response:", response.body);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Signup successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
    }, 15000);

    test("POST /api/v1/signup - Should fail with invalid data", async () => {
      const invalidData = {
        username: "test",
        email: "invalid-email",
        password: "123",
        address: "ab",
      };

      const response = await request(app)
        .post("/api/v1/signup")
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    }, 10000);

    test("POST /api/v1/signin - Should authenticate user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        address: "123 Test Street",
      };

      await request(app).post("/api/v1/signup").send(userData);

      const signinData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/v1/signin")
        .send(signinData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Signin successful");
      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    }, 15000);

    test("POST /api/v1/signin - Should fail with wrong credentials", async () => {
      const signinData = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/v1/signin")
        .send(signinData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email or password");
    }, 10000);
  });

  describe("User Management", () => {
    beforeEach(async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        address: "123 Test Street",
      };

      const signupResponse = await request(app)
        .post("/api/v1/signup")
        .send(userData);

      // Safely access user ID
      authToken = signupResponse.body.token;
      testUserId =
        signupResponse.body.user?._id || signupResponse.body.user?.id;

      if (!testUserId) {
        console.error(
          "No user ID found in signup response:",
          signupResponse.body
        );
      }
    });

    test("GET /api/v1/userInfo - Should get user info with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/userInfo")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("testuser");
      expect(response.body.email).toBe("test@example.com");
      expect(response.body.password).toBeUndefined();
    }, 10000);

    test("GET /api/v1/userInfo - Should fail without token", async () => {
      const response = await request(app).get("/api/v1/userInfo");

      expect(response.status).toBe(401);
    }, 10000);

    test("PUT /api/v1/update_address - Should update user address", async () => {
      const newAddress = "456 New Street";

      const response = await request(app)
        .put("/api/v1/update_address")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ address: newAddress });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Address updated");
      expect(response.body.user.address).toBe(newAddress);
    }, 10000);

    test("PUT /api/v1/update_address - Should fail with invalid address", async () => {
      const response = await request(app)
        .put("/api/v1/update_address")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ address: "ab" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    }, 10000);
  });

  describe("Book Management", () => {
    beforeEach(async () => {
      const adminData = {
        username: "admin",
        email: "admin@example.com",
        password: "password123",
        address: "Admin Street",
        role: "admin",
      };

      const signupResponse = await request(app)
        .post("/api/v1/signup")
        .send(adminData);
      adminToken = signupResponse.body.token;
    });

    test("POST /api/v1/addbook - Should add book with admin token", async () => {
      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      const response = await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(bookData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Book added successfully");
      expect(response.body.bookId).toBeDefined();
      testBookId = response.body.bookId;
    }, 15000);

    test("POST /api/v1/addbook - Should fail without admin token", async () => {
      const userData = {
        username: "regularuser",
        email: "user@example.com",
        password: "password123",
        address: "User Street",
      };

      const signupResponse = await request(app)
        .post("/api/v1/signup")
        .send(userData);
      const userToken = signupResponse.body.token;

      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      const response = await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${userToken}`)
        .send(bookData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Only admin can add books");
    }, 15000);

    test("GET /api/v1/allbooks - Should get all books", async () => {
      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(bookData);

      const response = await request(app).get("/api/v1/allbooks");

      expect(response.status).toBe(200);
      expect(response.body.books).toBeInstanceOf(Array);
      expect(response.body.books.length).toBeGreaterThan(0);
    }, 15000);

    test("PUT /api/v1/updatebook/:bookId - Should update book", async () => {
      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      const addResponse = await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(bookData);

      const bookId = addResponse.body.bookId;

      const updateData = {
        title: "Updated Book Title",
        price: "39.99",
      };

      const response = await request(app)
        .put(`/api/v1/updatebook/${bookId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book updated");
      expect(response.body.book.title).toBe("Updated Book Title");
      expect(response.body.book.price).toBe("39.99");
    }, 15000);

    test("DELETE /api/v1/deletebook/:bookId - Should delete book", async () => {
      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      const addResponse = await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(bookData);

      const bookId = addResponse.body.bookId;

      const response = await request(app)
        .delete(`/api/v1/deletebook/${bookId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book deleted successfully");
    }, 15000);
  });

  describe("Cart Management", () => {
    beforeEach(async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        address: "123 Test Street",
      };

      const signupResponse = await request(app)
        .post("/api/v1/signup")
        .send(userData);
      authToken = signupResponse.body.token;

      const adminData = {
        username: "admin",
        email: "admin@example.com",
        password: "password123",
        address: "Admin Street",
        role: "admin",
      };

      const adminSignupResponse = await request(app)
        .post("/api/v1/signup")
        .send(adminData);
      adminToken = adminSignupResponse.body.token;

      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      const addBookResponse = await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(bookData);

      testBookId = addBookResponse.body.bookId;
    });

    test("PUT /api/v1/addtocart/:bookId - Should add book to cart", async () => {
      const response = await request(app)
        .put(`/api/v1/addtocart/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book added to cart");
      expect(response.body.cart).toContain(testBookId);
    }, 15000);

    test("PUT /api/v1/addtocart/:bookId - Should fail adding same book twice", async () => {
      await request(app)
        .put(`/api/v1/addtocart/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .put(`/api/v1/addtocart/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Book is already in cart");
    }, 15000);

    test("PUT /api/v1/removefromcart/:bookId - Should remove book from cart", async () => {
      await request(app)
        .put(`/api/v1/addtocart/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .put(`/api/v1/removefromcart/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book removed from cart");
      expect(response.body.cart).not.toContain(testBookId);
    }, 15000);

    test("PUT /api/v1/removefromcart/:bookId - Should fail removing non-existent book", async () => {
      const response = await request(app)
        .put(`/api/v1/removefromcart/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Book is not in cart");
    }, 10000);
  });

  describe("Favourites Management", () => {
    beforeEach(async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        address: "123 Test Street",
      };

      const signupResponse = await request(app)
        .post("/api/v1/signup")
        .send(userData);
      authToken = signupResponse.body.token;

      const adminData = {
        username: "admin",
        email: "admin@example.com",
        password: "password123",
        address: "Admin Street",
        role: "admin",
      };

      const adminSignupResponse = await request(app)
        .post("/api/v1/signup")
        .send(adminData);
      adminToken = adminSignupResponse.body.token;

      const bookData = {
        url: "https://example.com/book.jpg",
        title: "Test Book",
        author: "Test Author",
        price: "29.99",
        desc: "A test book description",
        language: "English",
      };

      const addBookResponse = await request(app)
        .post("/api/v1/addbook")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(bookData);

      testBookId = addBookResponse.body.bookId;
    });

    test("PUT /api/v1/addtofavourites/:bookId - Should add book to favourites", async () => {
      const response = await request(app)
        .put(`/api/v1/addtofavourites/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book added to favourites");
      expect(response.body.favourites).toContain(testBookId);
    }, 15000);

    test("PUT /api/v1/addtofavourites/:bookId - Should fail adding same book twice", async () => {
      await request(app)
        .put(`/api/v1/addtofavourites/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .put(`/api/v1/addtofavourites/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Book already in favourites");
    }, 15000);

    test("PUT /api/v1/addtofavourites/:bookId - Should fail with non-existent book", async () => {
      const fakeBookId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/v1/addtofavourites/${fakeBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Book not found");
    }, 10000);

    test("PUT /api/v1/removefromfavourites/:bookId - Should remove book from favourites", async () => {
      await request(app)
        .put(`/api/v1/addtofavourites/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      const response = await request(app)
        .put(`/api/v1/removefromfavourites/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book removed from favourites");
      expect(response.body.favourites).not.toContain(testBookId);
    }, 15000);

    test("PUT /api/v1/removefromfavourites/:bookId - Should fail removing non-existent book", async () => {
      const response = await request(app)
        .put(`/api/v1/removefromfavourites/${testBookId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Book is not in favourites");
    }, 10000);
  });
});
