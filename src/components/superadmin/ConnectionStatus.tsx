"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

type ConnectionType = "vps" | "railway" | "supabase" | "telegram" | "claude";
type ConnectionStatus = "connected" | "disconnected" | "checking";

interface Connection {
  id: ConnectionType;
  name: string;
  status: ConnectionStatus;
  lastCheck: string;
  details?: string;
}

export function ConnectionStatus() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "vps",
      name: "VPS Hetzner",
      status: "checking",
      lastCheck: "-",
      details: "178.156.188.72",
    },
    {
      id: "railway",
      name: "Railway API",
      status: "checking",
      lastCheck: "-",
    },
    {
      id: "supabase",
      name: "Supabase DB",
      status: "checking",
      lastCheck: "-",
    },
    {
      id: "telegram",
      name: "Telegram Bot",
      status: "checking",
      lastCheck: "-",
      details: "@agustin_agente_bot",
    },
    {
      id: "claude",
      name: "Claude API",
      status: "checking",
      lastCheck: "-",
    },
  ]);

  useEffect(() => {
    // TODO: Implementar checks reales
    const checkConnections = async () => {
      // Simular checks (reemplazar con llamadas reales)
      setTimeout(() => {
        setConnections((prev) =>
          prev.map((conn) => ({
            ...conn,
            status: Math.random() > 0.2 ? "connected" : "disconnected",
            lastCheck: new Date().toLocaleTimeString(),
          }))
        );
      }, 1000);
    };

    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check cada 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      {connections.map((conn) => (
        <div
          key={conn.id}
          className="flex items-center justify-between p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              {conn.status === "connected" ? (
                <CheckCircle className="w-5 h-5 text-accent-success" />
              ) : conn.status === "disconnected" ? (
                <XCircle className="w-5 h-5 text-accent-error" />
              ) : (
                <Clock className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary animate-spin" />
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {conn.name}
              </p>
              {conn.details && (
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {conn.details}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <p
              className={`text-sm font-medium ${
                conn.status === "connected"
                  ? "text-accent-success"
                  : conn.status === "disconnected"
                  ? "text-accent-error"
                  : "text-light-text-tertiary dark:text-dark-text-tertiary"
              }`}
            >
              {conn.status === "connected"
                ? "Conectado"
                : conn.status === "disconnected"
                ? "Desconectado"
                : "Verificando..."}
            </p>
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              {conn.lastCheck}
            </p>
          </div>
        </div>
      ))}

      <button className="btn btn-secondary w-full mt-2">
        Verificar todas las conexiones
      </button>
    </div>
  );
}
