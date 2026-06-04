import type { FastifyInstance } from "fastify";
import { buildAnalytics } from "../services/analyticsService";

export async function analyticsRoutes(app: FastifyInstance) {
  app.get("/api/analytics", async (_req, reply) => {
    return reply.send(buildAnalytics());
  });
}