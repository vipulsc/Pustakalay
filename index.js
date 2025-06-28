const express = require("express");
const cors = require("cors");
const connectDB = require("./db/sever");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", require("./routes/userAuth"));
app.use("/api/v1", require("./routes/user"));
app.use("/api/v1", require("./routes/book"));
app.use("/api/v1", require("./routes/cart"));
app.use("/api/v1", require("./routes/favourite"));

// Health check
app.get("/", (req, res) => {
  res.send("Backend is Running");
});

// Connect to database
connectDB();

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is Running on Port ${port}`);
  });
}

module.exports = app;
