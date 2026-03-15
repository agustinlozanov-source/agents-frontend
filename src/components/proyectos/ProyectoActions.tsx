"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Proyecto } from "@/lib/supabase";
import { MoreVertical, Trash2, CheckCircle, Folder, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ProyectoActionsProps {
  proyecto: Proyecto;
}

const statusOptions = ["idea", "investigacion", "desarrollo", "completado", "pausado"] as const;

export function ProyectoActions({ proyecto }: ProyectoActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    carpeta_vps: proyecto.carpeta_vps || "",
    repo_github: proyecto.repo_github || "",
    url_produccion: proyecto.url_produccion || "",
  });

  const handleChangeStatus = async (newStatus: Proyecto["status"]) => {
    setIsOpen(false);
    try {
      await api.updateProyecto(proyecto.id, { status: newStatus });
      toast.success(`Estado cambiado a ${newStatus}`);
      setTimeout(() => router.refresh(), 500);
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProyecto(proyecto.id, editData);
      toast.success("Proyecto actualizado");
      setIsEditOpen(false);
      setTimeout(() => router.refresh(), 500);
    } catch {
      toast.error("Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${proyecto.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.deleteProyecto(proyecto.id);
      toast.success("Proyecto eliminado");
      router.push("/proyectos");
    } catch {
      toast.error("Error al eliminar proyecto");
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-lg z-20">
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  Cambiar estado
                </p>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleChangeStatus(status)}
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
                  onClick={() => { setIsOpen(false); setIsEditOpen(true); }}
                  className="w-full px-3 py-2 text-sm text-left rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" />
                  Configurar carpeta VPS
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

      {/* Edit modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                Configurar proyecto
              </h2>
              <button onClick={() => setIsEditOpen(false)} className="p-1 rounded hover:bg-light-bg dark:hover:bg-dark-bg">
                <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Carpeta en VPS
                  <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary ml-2">(requerida para deploy)</span>
                </label>
                <input
                  type="text"
                  value={editData.carpeta_vps}
                  onChange={(e) => setEditData({ ...editData, carpeta_vps: e.target.value })}
                  className="input"
                  placeholder="mi-proyecto"
                />
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                  Ruta: /root/agente_ia/proyectos/<strong>{editData.carpeta_vps || "..."}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  Repositorio GitHub
                </label>
                <input
                  type="url"
                  value={editData.repo_github}
                  onChange={(e) => setEditData({ ...editData, repo_github: e.target.value })}
                  className="input"
                  placeholder="https://github.com/usuario/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  URL de Producción
                </label>
                <input
                  type="url"
                  value={editData.url_produccion}
                  onChange={(e) => setEditData({ ...editData, url_produccion: e.target.value })}
                  className="input"
                  placeholder="https://miproyecto.com"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-secondary flex-1" disabled={isSaving}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex-1 flex items-center justify-center gap-2" disabled={isSaving}>
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</> : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
