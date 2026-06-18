import mongoose from "mongoose";

import { config } from "./env.js";

export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(config.databaseUrl);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};
