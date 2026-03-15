import { supabaseAdmin, type AgenteTarea } from "@/lib/supabase";
import { Activity } from "lucide-react";
import { agenteLabels } from "@/lib/utils";
import { RelativeTime } from "@/components/RelativeTime";

export const revalidate = 0;

async function getTareas() {
  const { data } = await supabaseAdmin
    .from("agente_tareas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data as AgenteTarea[]) || [];
}

export default async function ActividadPage() {
  const tareas = await getTareas();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
          <Activity className="w-6 h-6 text-accent-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Actividad
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Historial completo de tareas ejecutadas por agentes
          </p>
        </div>
      </div>

      <div className="card space-y-3">
        {tareas.length === 0 ? (
          <p className="text-center py-12 text-light-text-tertiary dark:text-dark-text-tertiary">
            No hay actividad registrada
          </p>
        ) : (
          tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="flex gap-3 pb-3 border-b border-light-border dark:border-dark-border last:border-0 last:pb-0"
            >
              <span className="text-2xl flex-shrink-0">
                {agenteLabels[tarea.agente_tipo]?.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-light-text-primary dark:text-dark-text-primary">
                    {agenteLabels[tarea.agente_tipo]?.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      tarea.status === "completado"
                        ? "bg-accent-success/10 text-accent-success"
                        : tarea.status === "procesando"
                        ? "bg-accent-warning/10 text-accent-warning"
                        : tarea.status === "error"
                        ? "bg-accent-error/10 text-accent-error"
                        : "bg-light-border dark:bg-dark-border text-light-text-tertiary dark:text-dark-text-tertiary"
                    }`}
                  >
                    {tarea.status}
                  </span>
                  <RelativeTime date={tarea.created_at} className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary ml-auto" />
                </div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5 truncate">
                  {tarea.input}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
