"use client";

import { useState } from "react";
import { X, Bot, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface ExecuteAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const agentTypes = [
  { id: "investigacion", name: "Investigación", icon: "🔍", description: "Investigación y análisis profundo" },
  { id: "programacion", name: "Programación", icon: "💻", description: "Generación de código y desarrollo" },
  { id: "automatizacion", name: "Automatización", icon: "⚙️", description: "Scripts y automatización de tareas" },
  { id: "auditor", name: "Auditor", icon: "📊", description: "Auditoría y reportes del proyecto" },
];

export function ExecuteAgentModal({ isOpen, onClose, onSuccess }: ExecuteAgentModalProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [input, setInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAgent || !input.trim()) return;

    setIsExecuting(true);
    setResult(null);

    try {
      const response = await api.executeAgent(selectedAgent, input);
      
      setResult({
        success: true,
        message: `Tarea enviada exitosamente. El agente ${agentTypes.find(a => a.id === selectedAgent)?.name} está trabajando en ello.`
      });

      // Reset form
      setTimeout(() => {
        setInput("");
        setSelectedAgent("");
        setResult(null);
        onSuccess?.();
        onClose();
      }, 2000);

    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Error al ejecutar el agente"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                Ejecutar Agente
              </h2>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Asigna una tarea a uno de tus agentes autónomos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
            disabled={isExecuting}
          >
            <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Agent */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-3">
              Selecciona un agente
            </label>
            <div className="grid grid-cols-2 gap-3">
              {agentTypes.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAgent === agent.id
                      ? "border-accent-primary bg-accent-primary/5"
                      : "border-light-border dark:border-dark-border hover:border-accent-primary/50"
                  }`}
                  disabled={isExecuting}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{agent.icon}</span>
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                      {agent.name}
                    </span>
                  </div>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {agent.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Task */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Describe la tarea
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ejemplo: Investiga las mejores prácticas de SEO para landing pages en 2026..."
              className="w-full px-4 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary min-h-32 resize-none"
              disabled={isExecuting}
              required
            />
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-2">
              Sé específico. El agente trabajará de forma autónoma en esta tarea.
            </p>
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? "bg-accent-success/10 border border-accent-success/20"
                  : "bg-accent-error/10 border border-accent-error/20"
              }`}
            >
              <p
                className={`text-sm ${
                  result.success ? "text-accent-success" : "text-accent-error"
                }`}
              >
                {result.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={isExecuting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isExecuting || !selectedAgent || !input.trim()}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  Ejecutar Agente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
