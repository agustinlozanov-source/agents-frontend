import { supabase, type Proyecto } from "@/lib/supabase";
import { FolderKanban, Plus, Filter, Search } from "lucide-react";
import { ProyectoCard } from "@/components/proyectos/ProyectoCard";
import { CreateProyectoButton } from "@/components/proyectos/CreateProyectoButton";
import { ProyectosFilters } from "@/components/proyectos/ProyectosFilters";

async function getProyectos() {
  const { data: proyectos, error } = await supabase
    .from("proyectos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching proyectos:", error);
    return [];
  }

  return proyectos as Proyecto[];
}

export default async function ProyectosPage() {
  const proyectos = await getProyectos();

  // Stats
  const stats = {
    total: proyectos.length,
    activos: proyectos.filter(p => p.status === "desarrollo").length,
    completados: proyectos.filter(p => p.status === "completado").length,
    pausados: proyectos.filter(p => p.status === "pausado").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <FolderKanban className="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Proyectos
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Gestiona todos tus proyectos en un solo lugar
            </p>
          </div>
        </div>

        <CreateProyectoButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Total
          </div>
          <div className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mt-1">
            {stats.total}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            En Desarrollo
          </div>
          <div className="text-2xl font-semibold text-accent-warning mt-1">
            {stats.activos}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Completados
          </div>
          <div className="text-2xl font-semibold text-accent-success mt-1">
            {stats.completados}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Pausados
          </div>
          <div className="text-2xl font-semibold text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
            {stats.pausados}
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProyectosFilters />

      {/* Projects Grid */}
      {proyectos.length === 0 ? (
        <div className="card text-center py-12">
          <FolderKanban className="w-16 h-16 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary opacity-50" />
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            No hay proyectos todavía
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Crea tu primer proyecto para empezar
          </p>
          <CreateProyectoButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectos.map((proyecto) => (
            <ProyectoCard key={proyecto.id} proyecto={proyecto} />
          ))}
        </div>
      )}
    </div>
  );
}
