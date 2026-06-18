import { app } from "./app.js";
import { config } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`API server is running on port ${config.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
