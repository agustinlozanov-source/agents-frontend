import Link from "next/link";
import { type Proyecto } from "@/lib/supabase";
import { statusLabels, tipoLabels, formatRelativeTime } from "@/lib/utils";
import { ExternalLink, Folder } from "lucide-react";

interface ProyectosListProps {
  proyectos: Proyecto[];
}

export function ProyectosList({ proyectos }: ProyectosListProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
          Proyectos Recientes
        </h2>
        <Link
          href="/proyectos"
          className="text-sm text-accent-primary hover:text-accent-secondary transition-colors"
        >
          Ver todos
        </Link>
      </div>

      <div className="space-y-3">
        {proyectos.length === 0 ? (
          <div className="text-center py-8 text-light-text-tertiary dark:text-dark-text-tertiary">
            <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay proyectos todavía</p>
            <Link
              href="/proyectos/nuevo"
              className="text-accent-primary hover:text-accent-secondary mt-2 inline-block"
            >
              Crear primer proyecto
            </Link>
          </div>
        ) : (
          proyectos.map((proyecto) => (
            <Link
              key={proyecto.id}
              href={`/proyectos/${proyecto.id}`}
              className="block p-4 rounded-lg border border-light-border dark:border-dark-border hover:border-accent-primary dark:hover:border-accent-primary transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary group-hover:text-accent-primary transition-colors">
                      {proyecto.nombre}
                    </h3>
                    {proyecto.url_produccion && (
                      <ExternalLink className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    {proyecto.cliente && (
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        {proyecto.cliente}
                      </span>
                    )}
                    {proyecto.tipo && (
                      <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                        {tipoLabels[proyecto.tipo]}
                      </span>
                    )}
                    <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                      {formatRelativeTime(proyecto.created_at)}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                    statusLabels[proyecto.status]?.color
                  }`}
                >
                  {statusLabels[proyecto.status]?.label}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
