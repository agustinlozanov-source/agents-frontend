"use client";

import { useState } from "react";
import { type AgenteTarea } from "@/lib/supabase";
import { agenteLabels } from "@/lib/utils";
import { RelativeTime } from "@/components/RelativeTime";
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Copy
} from "lucide-react";
import { DeployButton } from "@/components/DeployButton";

interface ProyectoTareasProps {
  tareas: AgenteTarea[];
  proyectoId: string;
}

export function ProyectoTareas({ tareas, proyectoId }: ProyectoTareasProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copiado al portapapeles");
    } catch (err) {
      console.error("Error copying:", err);
    }
  };

  if (tareas.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileText className="w-16 h-16 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary opacity-50" />
        <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
          No hay tareas todavía
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Ejecuta un agente para crear la primera tarea de este proyecto
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
        Tareas Ejecutadas por Agentes
      </h2>

      <div className="space-y-3">
        {tareas.map((tarea) => {
          const agente = agenteLabels[tarea.agente_tipo];
          const isExpanded = expandedId === tarea.id;

          return (
            <div
              key={tarea.id}
              className="border border-light-border dark:border-dark-border rounded-lg overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : tarea.id)}
                className="w-full p-4 flex items-center gap-3 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors text-left"
              >
                {/* Icon & Agente */}
                <span className="text-2xl flex-shrink-0">{agente.icon}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                      {agente.label}
                    </span>
                    
                    {/* Status badge */}
                    {tarea.status === "completado" && (
                      <CheckCircle className="w-4 h-4 text-accent-success" />
                    )}
                    {tarea.status === "error" && (
                      <AlertCircle className="w-4 h-4 text-accent-error" />
                    )}
                    {tarea.status === "procesando" && (
                      <Clock className="w-4 h-4 text-accent-warning animate-pulse" />
                    )}
                    
                    <RelativeTime date={tarea.created_at} className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary" />
                  </div>
                  
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                    {tarea.input}
                  </p>
                </div>

                {/* Expand icon */}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary flex-shrink-0" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-light-border dark:border-dark-border">
                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        Input (Tarea asignada)
                      </label>
                      <button
                        onClick={() => copyToClipboard(tarea.input)}
                        className="p-1 hover:bg-light-bg dark:hover:bg-dark-bg rounded"
                      >
                        <Copy className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                      </button>
                    </div>
                    <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg">
                      <p className="text-sm text-light-text-primary dark:text-dark-text-primary whitespace-pre-wrap">
                        {tarea.input}
                      </p>
                    </div>
                  </div>

                  {/* Output */}
                  {tarea.output && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                          Output (Resultado)
                        </label>
                        <button
                          onClick={() => copyToClipboard(tarea.output!)}
                          className="p-1 hover:bg-light-bg dark:hover:bg-dark-bg rounded"
                        >
                          <Copy className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                        </button>
                      </div>
                      <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg max-h-96 overflow-y-auto">
                        <p className="text-sm text-light-text-primary dark:text-dark-text-primary whitespace-pre-wrap font-mono">
                          {tarea.output}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Deploy */}
                  <DeployButton
                    proyectoId={proyectoId}
                    tareaId={tarea.id}
                    deployed={tarea.metadata?.deployed}
                  />

                  {/* Archivos generados */}
                  {tarea.archivos_generados && Array.isArray(tarea.archivos_generados) && tarea.archivos_generados.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2 block">
                        Archivos Generados
                      </label>
                      <div className="space-y-2">
                        {tarea.archivos_generados.map((archivo: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-light-bg dark:bg-dark-bg text-sm text-light-text-secondary dark:text-dark-text-secondary font-mono"
                          >
                            📄 {archivo}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-light-text-tertiary dark:text-dark-text-tertiary pt-2 border-t border-light-border dark:border-dark-border">
                    <span>ID: {tarea.id.substring(0, 8)}...</span>
                    {tarea.tiempo_ejecucion && (
                      <span>Tiempo: {tarea.tiempo_ejecucion}</span>
                    )}
                    <span>Status: {tarea.status}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
