import Link from "next/link";
import { type AgenteTarea } from "@/lib/supabase";
import { agenteLabels, formatRelativeTime } from "@/lib/utils";
import { Activity } from "lucide-react";

interface ActivityFeedProps {
  tareas: AgenteTarea[];
}

export function ActivityFeed({ tareas }: ActivityFeedProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-accent-primary" />
        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
          Actividad Reciente
        </h2>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tareas.length === 0 ? (
          <p className="text-center py-8 text-light-text-tertiary dark:text-dark-text-tertiary text-sm">
            No hay actividad reciente
          </p>
        ) : (
          tareas.map((tarea) => {
            const inner = (
              <>
                <span className="text-2xl flex-shrink-0">
                  {agenteLabels[tarea.agente_tipo]?.icon}
                </span>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                    <span className="font-medium">
                      {agenteLabels[tarea.agente_tipo]?.label}
                    </span>
                    {" "}
                    {tarea.status === "completado"
                      ? "completó tarea"
                      : tarea.status === "procesando"
                      ? "está trabajando"
                      : tarea.status === "error"
                      ? "falló en tarea"
                      : "tarea pendiente"}
                  </p>
                  
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-0.5 truncate">
                    {tarea.input.substring(0, 60)}
                    {tarea.input.length > 60 && "..."}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs ${
                        tarea.status === "completado"
                          ? "text-accent-success"
                          : tarea.status === "procesando"
                          ? "text-accent-warning"
                          : tarea.status === "error"
                          ? "text-accent-error"
                          : "text-light-text-tertiary dark:text-dark-text-tertiary"
                      }`}
                    >
                      {tarea.status}
                    </span>
                    <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      •
                    </span>
                    <span suppressHydrationWarning className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {formatRelativeTime(tarea.created_at)}
                    </span>
                  </div>
                </div>
              </>
            );

            const itemClass = "flex gap-3 pb-3 border-b border-light-border dark:border-dark-border last:border-0 last:pb-0 rounded-md transition-colors hover:bg-light-bg dark:hover:bg-dark-bg -mx-2 px-2 cursor-pointer";
            const href = tarea.proyecto_id ? `/proyectos/${tarea.proyecto_id}` : `/agentes`;

            return (
              <Link
                key={tarea.id}
                href={href}
                className={itemClass}
              >
                {inner}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
