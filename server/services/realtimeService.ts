// ============================================================
// REALTIME SERVICE — Server-Sent Events para notificaciones
// Mecánica genérica de conexión/broadcast (patrón de seguridad-edomex,
// sin el simulador de eventos aleatorios — evitar desde el día uno el
// anti-patrón de generar/persistir datos falsos automáticamente).
// ============================================================

import { EventEmitter } from "events";
import type { Request, Response } from "express";
import { logger } from "../_core/logger";

// ── Tipos de eventos ────────────────────────────────────────
// Extender aquí conforme se agreguen módulos reales (trámites, citas,
// asignación de ventanillas, etc.) — ninguno de estos emite todavía.
export type EventType = "sistema" | "kpi_actualizado";

export interface RealtimeEvent {
  id: string;
  type: EventType;
  timestamp: number;
  data: Record<string, unknown>;
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
}

// ── Event Bus global ────────────────────────────────────────
class RealtimeEventBus extends EventEmitter {
  private clients: Map<string, Response> = new Map();
  private eventHistory: RealtimeEvent[] = [];
  private maxHistory = 100;

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  addClient(clientId: string, res: Response): void {
    this.clients.set(clientId, res);
    logger.info(`[SSE] Cliente conectado: ${clientId} (total: ${this.clients.size})`);

    this.sendToClient(clientId, {
      id: `sys-${Date.now()}`,
      type: "sistema",
      timestamp: Date.now(),
      data: { connected: true, clientId },
      severity: "success",
      title: "Conexión Establecida",
      message: "Canal de tiempo real activo",
    });
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
    logger.info(`[SSE] Cliente desconectado: ${clientId} (total: ${this.clients.size})`);
  }

  private sendToClient(clientId: string, event: RealtimeEvent): void {
    const res = this.clients.get(clientId);
    if (res && !res.writableEnded) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  broadcast(event: RealtimeEvent): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistory);
    }

    this.emit("event", event);

    const entries = Array.from(this.clients.entries());
    for (const [cId, cRes] of entries) {
      if (!cRes.writableEnded) {
        cRes.write(`data: ${JSON.stringify(event)}\n\n`);
      } else {
        this.clients.delete(cId);
      }
    }
  }

  getHistory(limit: number = 50): RealtimeEvent[] {
    return this.eventHistory.slice(-limit);
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

// ── Singleton ───────────────────────────────────────────────
export const eventBus = new RealtimeEventBus();

// ── Express SSE handler ─────────────────────────────────────
export function sseHandler(req: Request, res: Response): void {
  const clientId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
    "Access-Control-Allow-Origin": "*",
  });

  res.flushHeaders();
  res.write(":ok\n\n");

  eventBus.addClient(clientId, res);

  const heartbeat = setInterval(() => {
    if (!res.writableEnded) {
      res.write(`:heartbeat ${Date.now()}\n\n`);
    }
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    eventBus.removeClient(clientId);
  });
}

// ── API para emitir eventos manualmente ─────────────────────
export function emitEvent(event: Omit<RealtimeEvent, "id" | "timestamp">): void {
  eventBus.broadcast({
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  });
}
