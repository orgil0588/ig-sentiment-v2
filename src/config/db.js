const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(
    "mongodb+srv://admin:admin123@sentiment.e0zmo.mongodb.net/sentimentTest?retryWrites=true&w=majority"
  );
  console.log(`Mongodb connected : ${conn.connection.host}`);
};

module.exports = connectDB;
