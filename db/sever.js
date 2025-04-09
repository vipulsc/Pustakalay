const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const server = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

server();
