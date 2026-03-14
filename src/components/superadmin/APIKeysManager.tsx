"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  key: string;
  masked: string;
}

const apiKeys: APIKey[] = [
  {
    id: "claude",
    name: "Claude API",
    key: "sk-ant-api03-...",
    masked: "sk-ant-api03-•••••••••••••••••",
  },
  {
    id: "openai",
    name: "OpenAI (Whisper)",
    key: "sk-proj-...",
    masked: "sk-proj-•••••••••••••••••",
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    key: "8379544482:AAE...",
    masked: "8379544482:•••••••••••••••••",
  },
  {
    id: "supabase",
    name: "Supabase Anon",
    key: "eyJhbGc...",
    masked: "eyJhbGc•••••••••••••••••",
  },
];

export function APIKeysManager() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (id: string, key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-3">
      {apiKeys.map((apiKey) => {
        const isVisible = visibleKeys.has(apiKey.id);
        const isCopied = copiedKey === apiKey.id;

        return (
          <div
            key={apiKey.id}
            className="p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                {apiKey.name}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(apiKey.id, apiKey.key)}
                  className="p-1 rounded hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  aria-label="Copiar"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-accent-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                  )}
                </button>
                <button
                  onClick={() => toggleVisibility(apiKey.id)}
                  className="p-1 rounded hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  aria-label={isVisible ? "Ocultar" : "Mostrar"}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                  ) : (
                    <Eye className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                  )}
                </button>
              </div>
            </div>
            <code className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary font-mono">
              {isVisible ? apiKey.key : apiKey.masked}
            </code>
          </div>
        );
      })}

      <button className="btn btn-primary w-full mt-2">
        Actualizar API Keys
      </button>
    </div>
  );
}
