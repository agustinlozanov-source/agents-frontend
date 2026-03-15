import { supabase, type AgenteSkill, type AgenteTarea } from "@/lib/supabase";
import { Bot, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { AgenteCard } from "@/components/agentes/AgenteCard";
import { AgentesMetrics } from "@/components/agentes/AgentesMetrics";
import { RelativeTime } from "@/components/RelativeTime";

const agenteTypes = [
  { id: "investigacion", name: "Investigación", icon: "🔍", color: "bg-blue-500" },
  { id: "programacion", name: "Programación", icon: "💻", color: "bg-green-500" },
  { id: "automatizacion", name: "Automatización", icon: "⚙️", color: "bg-purple-500" },
  { id: "auditor", name: "Auditor", icon: "📊", color: "bg-orange-500" },
];

async function getAgentesData() {
  // Skills
  const { data: skills } = await supabase
    .from("agente_skills")
    .select("*")
    .order("agente_tipo");

  // Tareas recientes
  const { data: tareas } = await supabase
    .from("agente_tareas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return {
    skills: skills as AgenteSkill[] || [],
    tareas: tareas as AgenteTarea[] || [],
  };
}

export default async function AgentesPage() {
  const { skills, tareas } = await getAgentesData();

  // Calcular métricas por agente
  const metrics = agenteTypes.map((agente) => {
    const agenteTareas = tareas.filter(t => t.agente_tipo === agente.id);
    const completadas = agenteTareas.filter(t => t.status === "completado").length;
    const errores = agenteTareas.filter(t => t.status === "error").length;
    const procesando = agenteTareas.filter(t => t.status === "procesando").length;

    return {
      ...agente,
      total: agenteTareas.length,
      completadas,
      errores,
      procesando,
      tasaExito: agenteTareas.length > 0 
        ? Math.round((completadas / agenteTareas.length) * 100) 
        : 0,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-accent-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Agentes
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Gestiona tus agentes autónomos y sus habilidades
          </p>
        </div>
      </div>

      {/* Overall Metrics */}
      <AgentesMetrics tareas={tareas} />

      {/* Agentes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agenteTypes.map((agente) => {
          const agenteSkills = skills.filter(s => s.agente_tipo === agente.id);
          const agenteMetrics = metrics.find(m => m.id === agente.id)!;

          return (
            <AgenteCard
              key={agente.id}
              agente={agente}
              skills={agenteSkills}
              metrics={agenteMetrics}
            />
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-primary" />
          Actividad Reciente
        </h2>

        <div className="space-y-3">
          {tareas.slice(0, 10).map((tarea) => {
            const agente = agenteTypes.find(a => a.id === tarea.agente_tipo);
            
            return (
              <div
                key={tarea.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
              >
                <span className="text-2xl">{agente?.icon}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-light-text-primary dark:text-dark-text-primary text-sm">
                      {agente?.name}
                    </span>
                    {tarea.status === "completado" && (
                      <CheckCircle className="w-4 h-4 text-accent-success" />
                    )}
                    {tarea.status === "error" && (
                      <AlertCircle className="w-4 h-4 text-accent-error" />
                    )}
                    {tarea.status === "procesando" && (
                      <Activity className="w-4 h-4 text-accent-warning animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                    {tarea.input}
                  </p>
                  <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    <RelativeTime date={tarea.created_at} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
