import type { FastifyInstance } from "fastify";
import { logService } from "../services/logService";

export async function logRoutes(app: FastifyInstance) {
  app.get("/api/logs", async (req, reply) => {
    const q = req.query as Record<string, string>;
    const result = logService.query({
      search: q.search,
      method: q.method,
      statusMin: q.statusMin ? parseInt(q.statusMin) : undefined,
      statusMax: q.statusMax ? parseInt(q.statusMax) : undefined,
      ip: q.ip,
      path: q.path,
      dateFrom: q.dateFrom,
      dateTo: q.dateTo,
      page: parseInt(q.page ?? "1"),
      pageSize: parseInt(q.pageSize ?? "50"),
    });
    return reply.send({ ...result, page: parseInt(q.page ?? "1"), pageSize: parseInt(q.pageSize ?? "50") });
  });

  app.delete("/api/logs", async (_req, reply) => {
    logService.clear();
    return reply.send({ ok: true });
  });
}