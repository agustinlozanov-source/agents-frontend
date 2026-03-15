"use client";

import { useEffect, useState } from "react";
import { supabase, type Proyecto, type AgenteTarea } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  FolderKanban,
  Bot,
  CheckCircle,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ProyectosList } from "@/components/ProyectosList";
import { AgentesStatus } from "@/components/AgentesStatus";
import { ActivityFeed } from "@/components/ActivityFeed";

export default function DashboardPage() {
  const { user } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tareas, setTareas] = useState<AgenteTarea[]>([]);
  const [stats, setStats] = useState({ totalProyectos: 0, tareasActivas: 0, tareasCompletadas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user]);

  async function loadDashboard() {
    setLoading(true);
    const [
      { data: proyectosData },
      { data: tareasData },
      { count: totalProyectos },
      { count: tareasActivas },
      { count: tareasCompletadas },
    ] = await Promise.all([
      supabase.from("proyectos").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("agente_tareas").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("proyectos").select("*", { count: "exact", head: true }),
      supabase.from("agente_tareas").select("*", { count: "exact", head: true }).eq("status", "procesando"),
      supabase.from("agente_tareas").select("*", { count: "exact", head: true }).eq("status", "completado"),
    ]);
    setProyectos((proyectosData as Proyecto[]) || []);
    setTareas((tareasData as AgenteTarea[]) || []);
    setStats({
      totalProyectos: totalProyectos || 0,
      tareasActivas: tareasActivas || 0,
      tareasCompletadas: tareasCompletadas || 0,
    });
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    );
  }

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
