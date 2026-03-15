import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/AppShell";
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
          <AuthProvider>
            <AppShell>
              {children}
            </AppShell>
          </AuthProvider>

          {/* Toasts — fuera del AuthProvider para disponibilidad global */}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
