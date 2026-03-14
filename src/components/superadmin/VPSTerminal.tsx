"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Terminal } from "lucide-react";
import { api } from "@/lib/api";

export function VPSTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ type: "command" | "output"; text: string }>>([
    { type: "output", text: "Conectado a VPS (root@178.156.188.72)" },
    { type: "output", text: "Escribe un comando o 'help' para ayuda" },
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isExecuting) return;

    // Agregar comando al historial
    setHistory((prev) => [...prev, { type: "command", text: input }]);
    setIsExecuting(true);

    try {
      // Ejecutar comando en el backend
      const result = await api.executeVPSCommand(input);

      // Agregar respuesta
      if (result.success) {
        setHistory((prev) => [
          ...prev,
          { type: "output", text: result.stdout || "Comando ejecutado" },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          { 
            type: "output", 
            text: result.stderr || result.error || "Error ejecutando comando" 
          },
        ]);
      }
    } catch (error: any) {
      setHistory((prev) => [
        ...prev,
        { type: "output", text: `Error: ${error.message}` },
      ]);
    } finally {
      setIsExecuting(false);
      setInput("");
    }
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
        {isExecuting && (
          <div className="text-accent-warning animate-pulse">
            Ejecutando...
          </div>
        )}
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
            disabled={isExecuting}
            className="input pl-10"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isExecuting}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
        ⚠️ Comandos permitidos: pm2 status, pm2 logs, ls, cat, pwd
      </p>
    </div>
  );
}
