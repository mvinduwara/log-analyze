import type { FastifyInstance } from "fastify";
import { parseBuffer } from "../parser/logParser";
import { logService } from "../services/logService";

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/api/upload", async (req, reply) => {
    const data = await req.file();
    if (!data) return reply.status(400).send({ error: "No file uploaded" });

    const chunks: Buffer[] = [];
    for await (const chunk of data.file) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString("utf-8");

    const { entries, failed } = parseBuffer(text);
    logService.add(entries);

    return reply.send({
      parsed: entries.length,
      failed,
      filename: data.filename,
    });
  });
}