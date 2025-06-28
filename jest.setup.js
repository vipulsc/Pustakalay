const mongoose = require("mongoose");

// Global test setup
beforeAll(async () => {
  // Set test timeout
  jest.setTimeout(30000);

  // Set test environment
  process.env.NODE_ENV = "test";
});

// Global test teardown
afterAll(async () => {
  try {
    // Close all database connections
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error("Cleanup error:", error);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
