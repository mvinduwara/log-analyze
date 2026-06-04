export const config = {
  port: parseInt(process.env.PORT ?? "3001", 10),
  host: process.env.HOST ?? "0.0.0.0",
  maxEntries: parseInt(process.env.MAX_ENTRIES ?? "100000", 10),
  logDir: process.env.LOG_DIR ?? "",
};