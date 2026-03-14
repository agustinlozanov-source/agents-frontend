import {
  Shield,
  Server,
  Key,
  Database,
  Webhook,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { ConnectionStatus } from "@/components/superadmin/ConnectionStatus";
import { APIKeysManager } from "@/components/superadmin/APIKeysManager";
import { SystemLogs } from "@/components/superadmin/SystemLogs";
import { VPSTerminal } from "@/components/superadmin/VPSTerminal";

export default function SuperadminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-error/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-accent-error" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Superadmin
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Configuración avanzada y gestión del sistema
          </p>
        </div>
      </div>

      {/* Warning */}
      <div className="card bg-accent-warning/5 border-accent-warning/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              Zona de administrador
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Los cambios aquí pueden afectar el funcionamiento del sistema.
              Procede con precaución.
            </p>
          </div>
        </div>
      </div>

      {/* Status de conexiones */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Estado de Conexiones
          </h2>
        </div>
        <ConnectionStatus />
      </div>

      {/* Grid de configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-accent-primary" />
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
              API Keys
            </h2>
          </div>
          <APIKeysManager />
        </div>

        {/* Database Info */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-accent-primary" />
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
              Base de Datos
            </h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                Proveedor
              </span>
              <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                Supabase (PostgreSQL)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                Región
              </span>
              <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                US East
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-text-secondary dark:text-dark-text-secondary">
                Tablas
              </span>
              <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                6 activas
              </span>
            </div>
            <button className="btn btn-secondary w-full mt-2">
              Ver Schema
            </button>
          </div>
        </div>
      </div>

      {/* VPS Terminal */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Terminal VPS
          </h2>
        </div>
        <VPSTerminal />
      </div>

      {/* System Logs */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Webhook className="w-5 h-5 text-accent-primary" />
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Logs del Sistema
          </h2>
        </div>
        <SystemLogs />
      </div>
    </div>
  );
}
