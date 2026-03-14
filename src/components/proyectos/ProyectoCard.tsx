import Link from "next/link";
import { type Proyecto } from "@/lib/supabase";
import { statusLabels, tipoLabels, formatRelativeTime } from "@/lib/utils";
import { ExternalLink, Github, Folder } from "lucide-react";

interface ProyectoCardProps {
  proyecto: Proyecto;
}

export function ProyectoCard({ proyecto }: ProyectoCardProps) {
  return (
    <Link
      href={`/proyectos/${proyecto.id}`}
      className="card hover:border-accent-primary dark:hover:border-accent-primary transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-accent-primary transition-colors truncate">
            {proyecto.nombre}
          </h3>
          {proyecto.cliente && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {proyecto.cliente}
            </p>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
            statusLabels[proyecto.status]?.color
          }`}
        >
          {statusLabels[proyecto.status]?.label}
        </span>
      </div>

      {/* Type */}
      {proyecto.tipo && (
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {tipoLabels[proyecto.tipo]}
          </span>
        </div>
      )}

      {/* Links */}
      <div className="flex items-center gap-3 mb-3">
        {proyecto.repo_github && (
          <a
            href={proyecto.repo_github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary hover:text-accent-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        )}
        {proyecto.url_produccion && (
          <a
            href={proyecto.url_produccion}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-light-text-tertiary dark:text-dark-text-tertiary hover:text-accent-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Producción
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-light-border dark:border-dark-border">
        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          Creado {formatRelativeTime(proyecto.created_at)}
        </p>
      </div>
    </Link>
  );
}
