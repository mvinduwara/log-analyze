import type { FastifyInstance } from "fastify";
import { alertService } from "../services/alertService";
import type { AlertRule } from "../types";

export async function alertRoutes(app: FastifyInstance) {
  app.get("/api/alerts/rules", async (_req, reply) => {
    return reply.send(alertService.getRules());
  });

  app.post("/api/alerts/rules", async (req, reply) => {
    const body = req.body as Omit<AlertRule, "id" | "createdAt">;
    const rule = alertService.addRule(body);
    return reply.status(201).send(rule);
  });

  app.delete("/api/alerts/rules/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const deleted = alertService.deleteRule(id);
    return deleted ? reply.send({ ok: true }) : reply.status(404).send({ error: "Not found" });
  });

  app.get("/api/alerts/events", async (_req, reply) => {
    return reply.send(alertService.getEvents());
  });
}