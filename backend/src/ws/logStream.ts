import type { FastifyInstance } from "fastify";
import { logService } from "../services/logService";
import { parseLine } from "../parser/logParser";

const DEMO_PATHS = ["/api/users", "/api/products", "/health", "/api/orders", "/static/app.js", "/api/auth/login", "/api/reports", "/favicon.ico"];
const DEMO_IPS = ["192.168.1.1", "10.0.0.42", "172.16.0.8", "203.0.113.5", "198.51.100.20"];
const DEMO_METHODS = ["GET", "GET", "GET", "POST", "PUT", "DELETE"];
const DEMO_STATUSES = [200, 200, 200, 200, 201, 204, 301, 304, 400, 401, 404, 500];

function generateDemoLine(): string {
  const ip = DEMO_IPS[Math.floor(Math.random() * DEMO_IPS.length)];
  const method = DEMO_METHODS[Math.floor(Math.random() * DEMO_METHODS.length)];
  const path = DEMO_PATHS[Math.floor(Math.random() * DEMO_PATHS.length)];
  const status = DEMO_STATUSES[Math.floor(Math.random() * DEMO_STATUSES.length)];
  const size = Math.floor(Math.random() * 10000) + 100;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${pad(now.getDate())}/${months[now.getMonth()]}/${now.getFullYear()}:${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} +0000`;
  return `${ip} - - [${dateStr}] "${method} ${path} HTTP/1.1" ${status} ${size} "-" "Mozilla/5.0 Demo"`;
}

export async function wsRoutes(app: FastifyInstance) {
  const clients = new Set<any>();

  app.get("/ws/logs", { websocket: true }, (socket) => {
    clients.add(socket);
    socket.on("close", () => clients.delete(socket));
  });

  setInterval(() => {
    if (clients.size === 0) return;
    const line = generateDemoLine();
    const entry = parseLine(line);
    if (!entry) return;
    logService.add([entry]);
    const payload = JSON.stringify(entry);
    for (const client of clients) {
      try { client.send(payload); } catch { clients.delete(client); }
    }
  }, 1500);
}