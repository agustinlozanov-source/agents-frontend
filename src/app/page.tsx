import { supabase, type Proyecto, type AgenteTarea } from "@/lib/supabase";
import {
  FolderKanban,
  Bot,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ProyectosList } from "@/components/ProyectosList";
import { AgentesStatus } from "@/components/AgentesStatus";
import { ActivityFeed } from "@/components/ActivityFeed";

async function getDashboardData() {
  // Proyectos
  const { data: proyectos, error: proyectosError } = await supabase
    .from("proyectos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Tareas de agentes
  const { data: tareas, error: tareasError } = await supabase
    .from("agente_tareas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  // Stats
  const { count: totalProyectos } = await supabase
    .from("proyectos")
    .select("*", { count: "exact", head: true });

  const { count: tareasActivas } = await supabase
    .from("agente_tareas")
    .select("*", { count: "exact", head: true })
    .eq("status", "procesando");

  const { count: tareasCompletadas } = await supabase
    .from("agente_tareas")
    .select("*", { count: "exact", head: true })
    .eq("status", "completado");

  return {
    proyectos: proyectos as Proyecto[] || [],
    tareas: tareas as AgenteTarea[] || [],
    stats: {
      totalProyectos: totalProyectos || 0,
      tareasActivas: tareasActivas || 0,
      tareasCompletadas: tareasCompletadas || 0,
    },
  };
}

export default async function DashboardPage() {
  const { proyectos, tareas, stats } = await getDashboardData();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
          Dashboard
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
          Resumen del estado de tus agentes y proyectos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Proyectos Totales"
          value={stats.totalProyectos}
          icon={FolderKanban}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Agentes Activos"
          value={stats.tareasActivas}
          icon={Bot}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Tareas Completadas"
          value={stats.tareasCompletadas}
          icon={CheckCircle}
          trend={{ value: 24, isPositive: true }}
        />
        <StatCard
          title="Tiempo Promedio"
          value="45s"
          icon={Clock}
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proyectos Recientes */}
        <div className="lg:col-span-2">
          <ProyectosList proyectos={proyectos} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AgentesStatus />
          <ActivityFeed tareas={tareas} />
        </div>
      </div>
    </div>
  );
}
