const express = require("express");
const app = express();
require("dotenv").config();
require("./db/sever");

const user = require("./routes/user");
const book = require("./routes/book");
app.use(express.json());
//Routes
app.use("/api/v1", user);
app.use("/api/v1", book);

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
