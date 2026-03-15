"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bot } from "lucide-react";
import { ExecuteAgentModal } from "./ExecuteAgentModal";

export function ExecuteAgentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Si estamos en /proyectos/[id], extraer el ID
  const proyectoMatch = pathname.match(/^\/proyectos\/([^/]+)/);
  const proyectoId = proyectoMatch ? proyectoMatch[1] : undefined;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent-primary hover:bg-accent-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-40"
        aria-label="Ejecutar agente"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal */}
      <ExecuteAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proyectoId={proyectoId}
        onSuccess={() => {
          setTimeout(() => router.refresh(), 500);
        }}
      />
    </>
  );
}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent-primary hover:bg-accent-secondary text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-40"
        aria-label="Ejecutar agente"
      >
        <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal */}
      <ExecuteAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setTimeout(() => router.refresh(), 500);
        }}
      />
    </>
  );
}
