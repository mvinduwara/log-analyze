import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import websocket from "@fastify/websocket";
import { config } from "./config.js";
import { uploadRoutes } from "./routes/upload.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { logRoutes } from "./routes/logs.js";
import { alertRoutes } from "./routes/alerts.js";
import { wsRoutes } from "./ws/logStream.js";
import { alertService } from "./services/alertService.js";

const app = Fastify({ logger: { level: "info" } });

async function main() {
  await app.register(cors, { origin: true });
  await app.register(multipart, { limits: { fileSize: 100 * 1024 * 1024 } });
  await app.register(websocket);

  await app.register(uploadRoutes);
  await app.register(analyticsRoutes);
  await app.register(logRoutes);
  await app.register(alertRoutes);
  await app.register(wsRoutes);

  app.get("/api/health", async () => ({ status: "ok", ts: new Date().toISOString() }));

  setInterval(() => alertService.evaluate(), 15000);

  await app.listen({ port: config.port, host: config.host });
  console.log(`🚀 LogLens backend running on http://localhost:${config.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});