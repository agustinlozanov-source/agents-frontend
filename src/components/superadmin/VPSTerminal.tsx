"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Terminal } from "lucide-react";

export function VPSTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    Array<{ type: "command" | "output"; text: string }>
  >([
    { type: "output", text: "Conectado a VPS (root@178.156.188.72)" },
    { type: "output", text: "Escribe 'help' para ver comandos disponibles" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Agregar comando al historial
    setHistory((prev) => [...prev, { type: "command", text: input }]);

    // TODO: Enviar comando real al backend → VPS
    // Por ahora simular respuesta
    const simulatedOutput = getSimulatedOutput(input);
    setTimeout(() => {
      setHistory((prev) => [...prev, { type: "output", text: simulatedOutput }]);
    }, 300);

    setInput("");
  };

  const getSimulatedOutput = (command: string): string => {
    if (command === "help") {
      return `Comandos disponibles:
  pm2 status        - Ver estado de procesos
  pm2 logs          - Ver logs del bot
  ls /root/agente_ia - Listar archivos
  cat [archivo]     - Ver contenido`;
    }
    if (command === "pm2 status") {
      return `┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┤
│ 0  │ agente-telegram    │ fork     │ 0    │ online    │ 0%       │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┘`;
    }
    return `bash: ${command}: comando no implementado aún`;
  };

  return (
    <div className="space-y-3">
      {/* Terminal output */}
      <div className="bg-dark-bg rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
        {history.map((item, i) => (
          <div key={i} className="mb-1">
            {item.type === "command" ? (
              <div className="text-accent-success">
                <span className="text-dark-text-tertiary">root@vps:~$</span>{" "}
                {item.text}
              </div>
            ) : (
              <div className="text-dark-text-secondary whitespace-pre-wrap">
                {item.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un comando..."
            className="input pl-10"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <Send className="w-4 h-4" />
        </button>
      </form>

      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
        ⚠️ Los comandos se ejecutan directamente en el VPS. Usa con precaución.
      </p>
    </div>
  );
}
