"use client";

import { useState } from "react";
import { Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeployButtonProps {
  proyectoId: string;
  tareaId: string;
  deployed?: boolean;
}

export function DeployButton({ proyectoId, tareaId, deployed }: DeployButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proyecto_id: proyectoId, tarea_id: tareaId })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Deploy completado", {
          description: "El código se subió a GitHub exitosamente",
          duration: 5000
        });
        
        // Refresh después de 2 segundos
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(data.error || 'Error en deploy');
      }

    } catch (error: any) {
      console.error('Error deploying:', error);
      toast.error("Error en deploy", {
        description: error.message || "No se pudo completar el deploy",
        duration: 5000
      });
    } finally {
      setIsDeploying(false);
    }
  };

  if (deployed) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-success/10 text-accent-success text-sm">
        <Rocket className="w-4 h-4" />
        Deployed
      </div>
    );
  }

  return (
    <button
      onClick={handleDeploy}
      disabled={isDeploying}
      className="btn btn-primary flex items-center gap-2"
    >
      {isDeploying ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Rocket className="w-4 h-4" />
          Deploy a GitHub
        </>
      )}
    </button>
  );
}
