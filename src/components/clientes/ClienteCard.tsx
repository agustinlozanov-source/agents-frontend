import { type Cliente } from "@/lib/supabase";
import { Mail, Building, Phone, FolderKanban } from "lucide-react";
import Link from "next/link";

interface ClienteCardProps {
  cliente: Cliente;
  proyectosCount: number;
}

export function ClienteCard({ cliente, proyectosCount }: ClienteCardProps) {
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
