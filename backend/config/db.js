const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error("MONGO_URL not set");
  await mongoose.connect(uri, { dbName: process.env.DB_NAME });
  console.log(`MongoDB connected → ${process.env.DB_NAME}`);
};

module.exports = connectDB;
