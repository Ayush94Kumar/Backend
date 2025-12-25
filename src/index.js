import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();   // MUST be before connectDB()

connectDB();
