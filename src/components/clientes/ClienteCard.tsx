"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Cliente } from "@/lib/supabase";
import { Mail, Building, Phone, FolderKanban, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ClienteCardProps {
  cliente: Cliente;
  proyectosCount: number;
}

export function ClienteCard({ cliente, proyectosCount }: ClienteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`¿Eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`)) return;
    setIsDeleting(true);
    try {
      await api.deleteCliente(cliente.id);
      toast.success("Cliente eliminado");
      setDeleted(true);
      router.refresh();
    } catch {
      toast.error("Error al eliminar cliente");
      setIsDeleting(false);
    }
  };

  if (deleted) return null;

  return (
    <div className="card hover:border-accent-primary dark:hover:border-accent-primary transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-accent-primary transition-colors truncate">
            {cliente.nombre}
          </h3>
          {cliente.empresa && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1 flex items-center gap-1">
              <Building className="w-3 h-3" />
              {cliente.empresa}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent-error/10 text-light-text-tertiary hover:text-accent-error transition-all"
          title="Eliminar cliente"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {cliente.email && (
          <a
            href={`mailto:${cliente.email}`}
            className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            {cliente.email}
          </a>
        )}
        {cliente.telefono && (
          <a
            href={`tel:${cliente.telefono}`}
            className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            {cliente.telefono}
          </a>
        )}
      </div>

      {/* Proyectos Count */}
      <div className="pt-3 border-t border-light-border dark:border-dark-border">
        <Link
          href={`/proyectos?cliente=${cliente.id}`}
          className="flex items-center justify-between text-sm hover:text-accent-primary transition-colors"
        >
          <span className="text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
            <FolderKanban className="w-4 h-4" />
            Proyectos
          </span>
          <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
            {proyectosCount}
          </span>
        </Link>
      </div>
    </div>
  );
}
