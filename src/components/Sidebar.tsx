"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bot,
  Settings,
  Shield,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Proyectos", href: "/proyectos", icon: FolderKanban },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Agentes", href: "/agentes", icon: Bot },
  { name: "Actividad", href: "/actividad", icon: Activity },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-light-border dark:border-dark-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Agentes Hub
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Superadmin button */}
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <Link
          href="/superadmin"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/superadmin"
              ? "bg-accent-error/10 text-accent-error"
              : "text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-accent-error"
          )}
        >
          <Shield className="w-5 h-5" />
          Superadmin
        </Link>
      </div>
    </aside>
  );
}
