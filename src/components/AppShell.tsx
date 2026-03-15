"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ExecuteAgentButton } from "@/components/ExecuteAgentButton";

const AUTH_PATHS = ["/login", "/signup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Botón flotante para ejecutar agentes */}
      <ExecuteAgentButton />
    </div>
  );
}
