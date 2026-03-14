"use client";

import { useState } from "react";
import { type Proyecto } from "@/lib/supabase";
import { MoreVertical, Edit, Trash2, CheckCircle } from "lucide-react";

interface ProyectoActionsProps {
  proyecto: Proyecto;
}

export function ProyectoActions({ proyecto }: ProyectoActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeStatus = async (newStatus: Proyecto["status"]) => {
    // TODO: Implementar cambio de status
    console.log("Changing status to:", newStatus);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    
    // TODO: Implementar eliminación
    console.log("Deleting project:", proyecto.id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg z-20">
            <div className="p-2">
              <p className="px-3 py-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Cambiar estado
              </p>
              
              {["idea", "investigacion", "desarrollo", "completado", "pausado"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleChangeStatus(status as Proyecto["status"])}
                  className="w-full px-3 py-2 text-sm text-left rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors flex items-center gap-2"
                >
                  {proyecto.status === status && (
                    <CheckCircle className="w-4 h-4 text-accent-success" />
                  )}
                  <span className="capitalize">{status}</span>
                </button>
              ))}

              <div className="border-t border-light-border dark:border-dark-border my-2" />

              <button
                onClick={() => {/* TODO: Editar */}}
                className="w-full px-3 py-2 text-sm text-left rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>

              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-sm text-left rounded-md hover:bg-accent-error/10 text-accent-error transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
