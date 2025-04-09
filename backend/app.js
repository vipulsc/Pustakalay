const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server is Running on Port 3000");
});

app.get("/", (req, res) => {
  res.send("Backend is Running");
});
