const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const uri = process.env.Atlas_uri;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
  serverSelectionTimeoutMS: 30000, 
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

module.exports = db;
