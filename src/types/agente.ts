// types/agente.ts
// Types para el sistema organizacional de agentes

export type AgenteNivel = 1 | 2 | 3; // 1=C-Suite, 2=Líderes, 3=Operativos

export type AgenteTipo = 'c_suite' | 'lider' | 'operativo';

export type AgenteRol =
  // C-Suite
  | 'ceo'
  | 'cfo'
  | 'coo'
  | 'cmo'
  | 'cto'
  // Líderes bajo CFO
  | 'lider_finanzas'
  | 'lider_auditorias'
  // Líderes bajo COO
  | 'lider_programacion'
  | 'lider_qa'
  | 'lider_infraestructura'
  // Líderes bajo CMO
  | 'lider_marketing_digital'
  | 'lider_diseno'
  // Líderes bajo CTO
  | 'lider_investigacion'
  | 'lider_innovacion'
  | 'lider_data'
  | 'lider_seguridad';

export type AgenteEstado = 'activo' | 'pausado' | 'mantenimiento';

export type AgenteModelo =
  | 'claude-sonnet-4-20250514'
  | 'claude-opus-4-20250514'
  | 'claude-haiku-4-20250307';

export interface AgentePermisos {
  apis: string[];
  credenciales: Record<string, string>;
  proyectos_permitidos: string[] | '*';
  rate_limit: {
    por_hora: number;
    por_dia: number;
  };
}

export interface AgenteMonitoreo {
  log_level: 'debug' | 'info' | 'warning' | 'error';
  notificaciones: {
    telegram?: boolean;
    email?: boolean;
  };
  alertas: {
    tasa_error_threshold: number;
    tiempo_ejecucion_threshold: number;
  };
}

export interface AgenteContexto {
  variables: Record<string, any>;
  memoria_habilitada: boolean;
  cache_ttl_segundos?: number;
}

export interface AgentePosicion {
  x: number;
  y: number;
}

export interface Agente {
  id: string;
  
  // Identidad
  nombre: string;
  descripcion?: string;
  icono: string;
  color: string;
  tipo: AgenteTipo;
  rol: AgenteRol;
  nivel: AgenteNivel;
  estado: AgenteEstado;
  
  // Configuración IA
  modelo: AgenteModelo;
  prompt_sistema: string;
  max_tokens: number;
  temperatura: number;
  timeout_segundos: number;
  
  // Skills
  skills: string[];
  
  // Permisos, Monitoreo, Contexto
  permisos: AgentePermisos;
  monitoreo: AgenteMonitoreo;
  contexto: AgenteContexto;
  
  // UI
  posicion: AgentePosicion;
  
  // Metadata
  created_at: string;
  updated_at: string;
  version: number;
}

// =====================================================
// DEPENDENCIAS
// =====================================================

export type DependenciaTipo =
  | 'secuencial'   // A → B (B empieza cuando A termina)
  | 'paralelo'     // A || B (ambos ejecutan simultáneamente)
  | 'condicional'  // Si condición → B
  | 'loop'         // Repite hasta que condición = true
  | 'fallback';    // Si A falla → B

export type DependenciaOnError = 'fail' | 'continue' | 'retry' | 'fallback';

export interface AgenteDependencia {
  id: string;
  agente_origen_id: string;
  agente_destino_id: string;
  
  tipo: DependenciaTipo;
  orden: number;
  condicion?: string; // Expresión JavaScript evaluable
  
  on_error: DependenciaOnError;
  max_retries: number;
  retry_delay_segundos: number;
  
  created_at: string;
}

// =====================================================
// TRIGGERS
// =====================================================

export type TriggerTipo = 'cron' | 'webhook' | 'agente' | 'manual' | 'evento';

export interface AgenteTriggerConfig {
  cron?: string; // Expresión cron
  webhook_url?: string;
  agente_origen_id?: string;
  evento_tipo?: string;
  descripcion?: string;
}

export interface AgenteTrigger {
  id: string;
  agente_id: string;
  
  tipo: TriggerTipo;
  nombre: string;
  
  config: AgenteTriggerConfig;
  condiciones: string[];
  
  activo: boolean;
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// EJECUCIONES
// =====================================================

export type EjecucionStatus =
  | 'iniciado'
  | 'procesando'
  | 'completado'
  | 'error'
  | 'timeout';

export interface AgenteEjecucion {
  id: string;
  agente_id: string;
  tarea_id?: string;
  
  trigger_tipo?: string;
  trigger_config?: any;
  
  status: EjecucionStatus;
  
  input?: any;
  output?: string;
  error_mensaje?: string;
  
  tiempo_inicio: string;
  tiempo_fin?: string;
  duracion_segundos?: number;
  
  tokens_usados?: number;
  costo_estimado?: number;
  
  metadata: Record<string, any>;
  
  created_at: string;
}

// =====================================================
// MÉTRICAS CALCULADAS
// =====================================================

export interface AgenteMetricas {
  agente_id: string;
  
  total_ejecuciones: number;
  ejecuciones_exitosas: number;
  ejecuciones_fallidas: number;
  ejecuciones_en_proceso: number;
  
  tasa_exito: number; // Porcentaje
  tiempo_promedio_segundos: number;
  
  tokens_totales: number;
  costo_total: number;
  
  ultima_ejecucion?: string;
}

// =====================================================
// HELPERS
// =====================================================

export const AGENTE_LABELS: Record<AgenteRol, string> = {
  // C-Suite
  ceo: 'CEO - Agente Ejecutivo',
  cfo: 'CFO - Director Financiero',
  coo: 'COO - Director de Operaciones',
  cmo: 'CMO - Director de Marketing',
  cto: 'CTO - Director de Tecnología',
  
  // Líderes
  lider_finanzas: 'Líder de Finanzas',
  lider_auditorias: 'Líder de Auditorías',
  lider_programacion: 'Líder de Programación',
  lider_qa: 'Líder de QA',
  lider_infraestructura: 'Líder de Infraestructura',
  lider_marketing_digital: 'Líder de Marketing Digital',
  lider_diseno: 'Líder de Diseño',
  lider_investigacion: 'Líder de Investigación',
  lider_innovacion: 'Líder de Innovación',
  lider_data: 'Líder de Data',
  lider_seguridad: 'Líder de Seguridad',
};

export const NIVEL_LABELS: Record<AgenteNivel, string> = {
  1: 'C-Suite',
  2: 'Líderes',
  3: 'Operativos',
};

export const ESTADO_COLORS: Record<AgenteEstado, string> = {
  activo: 'bg-green-500/10 text-green-500 border-green-500/20',
  pausado: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  mantenimiento: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const STATUS_COLORS: Record<EjecucionStatus, string> = {
  iniciado: 'bg-blue-500/10 text-blue-500',
  procesando: 'bg-yellow-500/10 text-yellow-500',
  completado: 'bg-green-500/10 text-green-500',
  error: 'bg-red-500/10 text-red-500',
  timeout: 'bg-orange-500/10 text-orange-500',
};
