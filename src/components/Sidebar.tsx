"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bot,
  Workflow,
  Settings,
  Shield,
  Activity,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Proyectos", href: "/proyectos", icon: FolderKanban },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Agentes", href: "/agentes", icon: Bot },
  { name: "Organigrama", href: "/agentes/workflows", icon: Workflow },
  { name: "Actividad", href: "/actividad", icon: Activity },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-14 border-r border-light-border dark:border-dark-border flex flex-col bg-transparent">
      {/* Logo */}
      <div className="h-14 flex items-center justify-center">
        <Link href="/" className="group relative flex items-center justify-center">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Agentes Hub
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center py-4 gap-1">
        {navigation.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg dark:hover:bg-dark-bg"
              )}
            >
              <item.icon className="w-5 h-5" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Superadmin + Logout */}
      <div className="flex flex-col items-center pb-4 gap-1">
        {/* Usuario actual */}
        {user && (
          <div className="group relative flex items-center justify-center w-10 h-10 rounded-md">
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-accent-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              {user.email}
            </span>
          </div>
        )}

        <Link
          href="/superadmin"
          className={cn(
            "group relative flex items-center justify-center w-10 h-10 rounded-md transition-colors",
            pathname === "/superadmin"
              ? "bg-accent-error/10 text-accent-error"
              : "text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-accent-error"
          )}
        >
          <Shield className="w-5 h-5" />
          <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Superadmin
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={signOut}
          className="group relative flex items-center justify-center w-10 h-10 rounded-md transition-colors text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-accent-error"
        >
          <LogOut className="w-5 h-5" />
          <span className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
