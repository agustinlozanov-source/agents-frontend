"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function CreateProyectoButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cliente: "",
    tipo: "landing" as "landing" | "app" | "ecommerce" | "custom",
    repo_github: "",
    url_produccion: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createProyecto(formData);
      toast.success("Proyecto creado", { duration: 5000 });

      // Reset y cerrar
      setFormData({
        nombre: "",
        cliente: "",
        tipo: "landing",
        repo_github: "",
        url_produccion: "",
      });
      setIsOpen(false);

      // Refresh data without killing React
      setTimeout(() => router.refresh(), 1000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error al crear proyecto", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Nuevo Proyecto
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg max-w-lg w-full">
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Crear Nuevo Proyecto
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="input"
              required
              placeholder="Mi Proyecto Increíble"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Cliente
            </label>
            <input
              type="text"
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              className="input"
              placeholder="Nombre del cliente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              className="input"
            >
              <option value="landing">Landing Page</option>
              <option value="app">Aplicación Web</option>
              <option value="ecommerce">E-commerce</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Repositorio GitHub
            </label>
            <input
              type="url"
              value={formData.repo_github}
              onChange={(e) => setFormData({ ...formData, repo_github: e.target.value })}
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
              value={formData.url_produccion}
              onChange={(e) => setFormData({ ...formData, url_produccion: e.target.value })}
              className="input"
              placeholder="https://miproyecto.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Crear Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
