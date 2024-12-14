import mongoose from "mongoose";

const connection = { isConnected: null };

export const connectToDB = async () => {
  try {
    if (connection.isConnected) {
      console.log("Already connected to the database.");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", db.connection.host);
    connection.isConnected = db.connection.readyState; // Save connection state
  } catch (error) {
    console.error("Couldn't connect with the database:", error.message);
  }
};
