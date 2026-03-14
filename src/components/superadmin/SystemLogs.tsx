import { supabase, type Log } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";

async function getRecentLogs() {
  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return logs as Log[] || [];
}

export async function SystemLogs() {
  const logs = await getRecentLogs();

  const getIcon = (nivel: Log["nivel"]) => {
    switch (nivel) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-accent-error" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-accent-warning" />;
      default:
        return <Info className="w-4 h-4 text-accent-primary" />;
    }
  };

  const getColor = (nivel: Log["nivel"]) => {
    switch (nivel) {
      case "error":
        return "text-accent-error";
      case "warning":
        return "text-accent-warning";
      default:
        return "text-light-text-primary dark:text-dark-text-primary";
    }
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {logs.length === 0 ? (
        <p className="text-center py-8 text-light-text-tertiary dark:text-dark-text-tertiary text-sm">
          No hay logs recientes
        </p>
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(log.nivel)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium uppercase ${getColor(
                    log.nivel
                  )}`}
                >
                  {log.nivel}
                </span>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  •
                </span>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {log.fuente}
                </span>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  •
                </span>
                <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  {formatRelativeTime(log.created_at)}
                </span>
              </div>

              <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                {log.mensaje}
              </p>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-accent-primary cursor-pointer hover:text-accent-secondary">
                    Ver detalles
                  </summary>
                  <pre className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1 p-2 bg-light-surface dark:bg-dark-surface rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
