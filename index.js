const express = require("express");
const app = express();
require("dotenv").config();
require("./db/sever");

const user = require("./routes/user");
const book = require("./routes/book");
const cart = require("./routes/cart");
const favourite = require("./routes/favourite");
app.use(express.json());

//Routes
app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", cart);
app.use("/api/v1", favourite);

//PORT
const port = process.env.PORT;

//Running on Local Host
app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});

//Default
app.get("/", (req, res) => {
  res.send("Backend is Running");
});

module.exports = app;
