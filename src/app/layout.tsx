import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../styles/globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ExecuteAgentButton } from "@/components/ExecuteAgentButton";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Agentes Hub - Sistema de Agentes Autónomos",
  description: "Plataforma de gestión y entrenamiento de agentes IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex h-screen bg-light-bg dark:bg-dark-bg">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>

          {/* Botón flotante para ejecutar agentes */}
          <ExecuteAgentButton />

          {/* Toasts */}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
