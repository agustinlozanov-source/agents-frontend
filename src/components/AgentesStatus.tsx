"use client";

import { Bot, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const agentes = [
  { id: "investigacion", nombre: "Investigación", icon: "🔍" },
  { id: "programacion", nombre: "Programación", icon: "💻" },
  { id: "automatizacion", nombre: "Automatización", icon: "⚙️" },
  { id: "auditor", nombre: "Auditor", icon: "📊" },
];

type AgenteStatus = "activo" | "idle" | "error";

export function AgentesStatus() {
  const [status, setStatus] = useState<Record<string, AgenteStatus>>({
    investigacion: "idle",
    programacion: "idle",
    automatizacion: "idle",
    auditor: "idle",
  });

  // TODO: Conectar con Supabase realtime para status real
  useEffect(() => {
    // Simular cambios de status (reemplazar con realtime)
    const interval = setInterval(() => {
      const randomAgente = agentes[Math.floor(Math.random() * agentes.length)];
      const randomStatus: AgenteStatus =
        Math.random() > 0.7 ? "activo" : "idle";
      
      setStatus((prev) => ({
        ...prev,
        [randomAgente.id]: randomStatus,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-accent-primary" />
        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
          Estado de Agentes
        </h2>
      </div>

      <div className="space-y-3">
        {agentes.map((agente) => (
          <div
            key={agente.id}
            className="flex items-center justify-between p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{agente.icon}</span>
              <div>
                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {agente.nombre}
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {status[agente.id] === "activo"
                    ? "Trabajando..."
                    : "En espera"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {status[agente.id] === "activo" && (
                <Activity className="w-4 h-4 text-accent-warning animate-pulse" />
              )}
              <div
                className={`w-2 h-2 rounded-full ${
                  status[agente.id] === "activo"
                    ? "bg-accent-success"
                    : status[agente.id] === "error"
                    ? "bg-accent-error"
                    : "bg-light-text-tertiary dark:bg-dark-text-tertiary"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
