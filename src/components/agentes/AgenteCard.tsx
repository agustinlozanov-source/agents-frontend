"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type AgenteSkill } from "@/lib/supabase";
import { api } from "@/lib/api";
import { Edit2, Save, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface AgenteCardProps {
  agente: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  skills: AgenteSkill[];
  metrics: {
    total: number;
    completadas: number;
    errores: number;
    procesando: number;
    tasaExito: number;
  };
}

export function AgenteCard({ agente, skills, metrics }: AgenteCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(skills[0]?.prompt || "");

  const handleSave = async () => {
    if (!skills[0]?.id) return;
    setIsSaving(true);
    try {
      await api.updateAgentSkill(skills[0].id, editedPrompt);
      toast.success("Prompt actualizado");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving prompt:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${agente.color} bg-opacity-10 flex items-center justify-center text-2xl`}>
            {agente.icon}
          </div>
          <div>
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {agente.name}
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {skills[0]?.nombre || "Sin configuración"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
        >
          {isEditing ? (
            <X className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
          ) : (
            <Edit2 className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
          )}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded bg-light-bg dark:bg-dark-bg">
          <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            Total
          </div>
          <div className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            {metrics.total}
          </div>
        </div>
        <div className="text-center p-2 rounded bg-light-bg dark:bg-dark-bg">
          <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            Éxito
          </div>
          <div className="text-lg font-semibold text-accent-success">
            {metrics.completadas}
          </div>
        </div>
        <div className="text-center p-2 rounded bg-light-bg dark:bg-dark-bg">
          <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            Errores
          </div>
          <div className="text-lg font-semibold text-accent-error">
            {metrics.errores}
          </div>
        </div>
        <div className="text-center p-2 rounded bg-light-bg dark:bg-dark-bg">
          <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
            Activo
          </div>
          <div className="text-lg font-semibold text-accent-warning">
            {metrics.procesando}
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Tasa de Éxito
          </span>
          <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-accent-success" />
            {metrics.tasaExito}%
          </span>
        </div>
        <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
          <div
            className="bg-accent-success h-2 rounded-full transition-all"
            style={{ width: `${metrics.tasaExito}%` }}
          />
        </div>
      </div>

      {/* Prompt Editor */}
      <div>
        <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
          System Prompt
        </label>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="input min-h-32 font-mono text-sm"
              placeholder="Escribe el prompt del agente..."
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-mono whitespace-pre-wrap">
              {skills[0]?.prompt || "Sin prompt configurado"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
