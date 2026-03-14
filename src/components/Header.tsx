"use client";

import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="h-16 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface" />
    );
  }

  return (
    <header className="h-16 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface flex items-center justify-between px-6">
      {/* Breadcrumbs o título pueden ir aquí */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notificaciones */}
        <button
          className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors relative"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-error rounded-full" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-dark-text-secondary" />
          ) : (
            <Moon className="w-5 h-5 text-light-text-secondary" />
          )}
        </button>
      </div>
    </header>
  );
}
