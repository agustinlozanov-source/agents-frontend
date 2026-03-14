import { type AgenteTarea } from "@/lib/supabase";
import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface AgentesMetricsProps {
  tareas: AgenteTarea[];
}

export function AgentesMetrics({ tareas }: AgentesMetricsProps) {
  const total = tareas.length;
  const completadas = tareas.filter(t => t.status === "completado").length;
  const errores = tareas.filter(t => t.status === "error").length;
  const procesando = tareas.filter(t => t.status === "procesando").length;
  const tasaExito = total > 0 ? Math.round((completadas / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-accent-primary" />
          <div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Tareas Totales
            </div>
            <div className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              {total}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-accent-success" />
          <div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Completadas
            </div>
            <div className="text-2xl font-semibold text-accent-success">
              {completadas}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-accent-error" />
          <div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Errores
            </div>
            <div className="text-2xl font-semibold text-accent-error">
              {errores}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-accent-warning" />
          <div>
            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Tasa de Éxito
            </div>
            <div className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              {tasaExito}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
