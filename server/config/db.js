const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/conclude_one";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n[DATABASE ERROR] Failed to connect to MongoDB: ${error.message}`);
    if (!process.env.MONGO_URI) {
      console.error("HINT: MONGO_URI environment variable is not set. For cloud deployment (Render), please provide a MongoDB Atlas connection string in your environment variables.\n");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
