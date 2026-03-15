"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, type Proyecto, type AgenteTarea } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Folder,
  Activity,
  Calendar,
  User
} from "lucide-react";
import Link from "next/link";
import { statusLabels, tipoLabels, formatDate } from "@/lib/utils";
import { RelativeTime } from "@/components/RelativeTime";
import { ProyectoTareas } from "@/components/proyectos/ProyectoTareas";
import { ProyectoActions } from "@/components/proyectos/ProyectoActions";

export default function ProyectoDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [tareas, setTareas] = useState<AgenteTarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (user && id) loadProyecto();
  }, [user, id]);

  async function loadProyecto() {
    setLoading(true);
    const { data: proyectoData, error } = await supabase
      .from("proyectos")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !proyectoData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data: tareasData } = await supabase
      .from("agente_tareas")
      .select("*")
      .eq("proyecto_id", id)
      .order("created_at", { ascending: false });

    setProyecto(proyectoData as Proyecto);
    setTareas((tareasData as AgenteTarea[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    );
  }

  if (notFound || !proyecto) {
    return (
      <div className="space-y-6">
        <Link
          href="/proyectos"
          className="inline-flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Proyectos
        </Link>
        <div className="card text-center py-12">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Proyecto no encontrado
          </p>
        </div>
      </div>
    );
  }

  // Stats de tareas
  const stats = {
    total: tareas.length,
    completadas: tareas.filter(t => t.status === "completado").length,
    procesando: tareas.filter(t => t.status === "procesando").length,
    errores: tareas.filter(t => t.status === "error").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Proyectos
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                {proyecto.nombre}
              </h1>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  statusLabels[proyecto.status]?.color
                }`}
              >
                {statusLabels[proyecto.status]?.label}
              </span>
            </div>

            {proyecto.cliente && (
              <p className="text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                <User className="w-4 h-4" />
                {proyecto.cliente}
              </p>
            )}
          </div>

          <ProyectoActions proyecto={proyecto} />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {proyecto.tipo && (
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
              <div>
                <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  Tipo
                </div>
                <div className="text-sm text-light-text-primary dark:text-dark-text-primary">
                  {tipoLabels[proyecto.tipo]}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <div>
              <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Creado
              </div>
              <div className="text-sm text-light-text-primary dark:text-dark-text-primary">
                {formatDate(proyecto.created_at, "PPP")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
            <div>
              <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Última actividad
              </div>
              <div className="text-sm text-light-text-primary dark:text-dark-text-primary">
                {tareas.length > 0
                  ? <RelativeTime date={tareas[0].created_at} />
                  : "Sin actividad"}
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-light-border dark:border-dark-border">
          {proyecto.repo_github && (
            <a
              href={proyecto.repo_github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              Ver Repositorio
            </a>
          )}
          {proyecto.url_produccion && (
            <a
              href={proyecto.url_produccion}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver en Producción
            </a>
          )}
          {proyecto.carpeta_vps && (
            <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              📁 {proyecto.carpeta_vps}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Total Tareas
          </div>
          <div className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mt-1">
            {stats.total}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Completadas
          </div>
          <div className="text-2xl font-semibold text-accent-success mt-1">
            {stats.completadas}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            En Proceso
          </div>
          <div className="text-2xl font-semibold text-accent-warning mt-1">
            {stats.procesando}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Errores
          </div>
          <div className="text-2xl font-semibold text-accent-error mt-1">
            {stats.errores}
          </div>
        </div>
      </div>

      {/* Tareas */}
      <ProyectoTareas tareas={tareas} proyectoId={proyecto.id} />
    </div>
  );
}
