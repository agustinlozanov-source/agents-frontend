import { Settings } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
          <Settings className="w-6 h-6 text-accent-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Configuración
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Ajustes del sistema
          </p>
        </div>
      </div>

      <div className="card text-center py-12">
        <Settings className="w-16 h-16 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary opacity-50" />
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Próximamente
        </p>
      </div>
    </div>
  );
}
