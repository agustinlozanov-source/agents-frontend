"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Proyecto } from "@/lib/supabase";
import { statusLabels, tipoLabels } from "@/lib/utils";
import { RelativeTime } from "@/components/RelativeTime";
import { ExternalLink, Github, Folder, Trash2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ProyectoCardProps {
  proyecto: Proyecto;
}

export function ProyectoCard({ proyecto }: ProyectoCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`¿Eliminar "${proyecto.nombre}"? Esta acción no se puede deshacer.`)) return;
    setIsDeleting(true);
    try {
      await api.deleteProyecto(proyecto.id);
      toast.success("Proyecto eliminado");
      setDeleted(true);
      router.refresh();
    } catch {
      toast.error("Error al eliminar proyecto");
      setIsDeleting(false);
    }
  };

  if (deleted) return null;

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
        <div className="flex items-center gap-1 flex-shrink-0">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              statusLabels[proyecto.status]?.color
            }`}
          >
            {statusLabels[proyecto.status]?.label}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent-error/10 text-light-text-tertiary hover:text-accent-error transition-all"
            title="Eliminar proyecto"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
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
          Creado <RelativeTime date={proyecto.created_at} />
        </p>
      </div>
    </Link>
  );
}
