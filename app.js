const express = require("express");
const app = express();
require("dotenv").config();
require("./db/sever");
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
