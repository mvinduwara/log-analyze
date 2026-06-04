import { useEffect, useRef, useCallback } from "react";
import type { LogEntry } from "@/types";

type Handler = (entry: LogEntry) => void;

export function useWebSocket(onEntry: Handler) {
  const wsRef = useRef<WebSocket | null>(null);
  const handlerRef = useRef<Handler>(onEntry);
  handlerRef.current = onEntry;

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${window.location.host}/ws/logs`;
    const ws = new WebSocket(url);

    ws.onmessage = (e) => {
      try {
        const entry: LogEntry = JSON.parse(e.data);
        handlerRef.current(entry);
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = () => {
      setTimeout(connect, 3000);
    };

    wsRef.current = ws;
    return ws;
  }, []);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.onclose = null;
      ws.close();
    };
  }, [connect]);
}