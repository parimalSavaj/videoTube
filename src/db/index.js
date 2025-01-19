import { configDotenv } from "dotenv";
configDotenv();
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

console.log("out side ",process.env.DEMO);

const connectDB = async () => {
  console.log("in side ",process.env.DEMO);
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    //? console.log("okg", connectionInstance);
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection Failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
