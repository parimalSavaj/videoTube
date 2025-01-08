import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });
import connectDB from "./db/index.js";

connectDB();
