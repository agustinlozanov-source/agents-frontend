// lib/api-agentes.ts
// Cliente API para el sistema de agentes

import { supabase } from './supabase';
import type {
  Agente,
  AgenteDependencia,
  AgenteTrigger,
  AgenteEjecucion,
  AgenteMetricas,
} from '@/types/agente';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =====================================================
// AGENTES CRUD
// =====================================================

export const agenteApi = {
  // Listar todos los agentes
  async getAll(): Promise<Agente[]> {
    const { data, error } = await supabase
      .from('agentes')
      .select('*')
      .order('nivel', { ascending: true })
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data as Agente[];
  },

  // Obtener un agente por ID
  async getById(id: string): Promise<Agente | null> {
    const { data, error } = await supabase
      .from('agentes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Agente;
  },

  // Obtener agentes por nivel
  async getByNivel(nivel: 1 | 2 | 3): Promise<Agente[]> {
    const { data, error } = await supabase
      .from('agentes')
      .select('*')
      .eq('nivel', nivel)
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data as Agente[];
  },

  // Obtener agentes por rol
  async getByRol(rol: string): Promise<Agente | null> {
    const { data, error } = await supabase
      .from('agentes')
      .select('*')
      .eq('rol', rol)
      .single();

    if (error) throw error;
    return data as Agente;
  },

  // Crear nuevo agente
  async create(agente: Partial<Agente>): Promise<Agente> {
    const { data, error } = await supabase
      .from('agentes')
      .insert(agente)
      .select()
      .single();

    if (error) throw error;
    return data as Agente;
  },

  // Actualizar agente
  async update(id: string, updates: Partial<Agente>): Promise<Agente> {
    const { data, error } = await supabase
      .from('agentes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agente;
  },

  // Eliminar agente
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('agentes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Cambiar estado del agente
  async changeStatus(
    id: string,
    estado: 'activo' | 'pausado' | 'mantenimiento'
  ): Promise<Agente> {
    return this.update(id, { estado });
  },

  // Actualizar posición en el canvas
  async updatePosition(id: string, x: number, y: number): Promise<void> {
    await this.update(id, {
      posicion: { x, y },
    });
  },

  // Clonar agente
  async clone(id: string, nuevoNombre: string): Promise<Agente> {
    const original = await this.getById(id);
    if (!original) throw new Error('Agente no encontrado');

    const { id: _, created_at, updated_at, version, ...agenteData } = original;

    const clonado = await this.create({
      ...agenteData,
      nombre: nuevoNombre,
      rol: 'custom' as any, // Los clones son custom
    });

    return clonado;
  },
};

// =====================================================
// DEPENDENCIAS
// =====================================================

export const dependenciaApi = {
  // Obtener todas las dependencias
  async getAll(): Promise<AgenteDependencia[]> {
    const { data, error } = await supabase
      .from('agente_dependencias')
      .select('*')
      .order('orden', { ascending: true });

    if (error) throw error;
    return data as AgenteDependencia[];
  },

  // Obtener dependencias de un agente (agentes que llama)
  async getByOrigen(agenteId: string): Promise<AgenteDependencia[]> {
    const { data, error } = await supabase
      .from('agente_dependencias')
      .select('*')
      .eq('agente_origen_id', agenteId)
      .order('orden', { ascending: true });

    if (error) throw error;
    return data as AgenteDependencia[];
  },

  // Obtener agentes que llaman a este agente
  async getByDestino(agenteId: string): Promise<AgenteDependencia[]> {
    const { data, error } = await supabase
      .from('agente_dependencias')
      .select('*')
      .eq('agente_destino_id', agenteId);

    if (error) throw error;
    return data as AgenteDependencia[];
  },

  // Crear dependencia
  async create(dep: Partial<AgenteDependencia>): Promise<AgenteDependencia> {
    const { data, error } = await supabase
      .from('agente_dependencias')
      .insert(dep)
      .select()
      .single();

    if (error) throw error;
    return data as AgenteDependencia;
  },

  // Eliminar dependencia
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('agente_dependencias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Actualizar dependencia
  async update(
    id: string,
    updates: Partial<AgenteDependencia>
  ): Promise<AgenteDependencia> {
    const { data, error } = await supabase
      .from('agente_dependencias')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AgenteDependencia;
  },
};

// =====================================================
// TRIGGERS
// =====================================================

export const triggerApi = {
  // Obtener triggers de un agente
  async getByAgente(agenteId: string): Promise<AgenteTrigger[]> {
    const { data, error } = await supabase
      .from('agente_triggers')
      .select('*')
      .eq('agente_id', agenteId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AgenteTrigger[];
  },

  // Crear trigger
  async create(trigger: Partial<AgenteTrigger>): Promise<AgenteTrigger> {
    const { data, error } = await supabase
      .from('agente_triggers')
      .insert(trigger)
      .select()
      .single();

    if (error) throw error;
    return data as AgenteTrigger;
  },

  // Actualizar trigger
  async update(
    id: string,
    updates: Partial<AgenteTrigger>
  ): Promise<AgenteTrigger> {
    const { data, error } = await supabase
      .from('agente_triggers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AgenteTrigger;
  },

  // Eliminar trigger
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('agente_triggers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Activar/desactivar trigger
  async toggle(id: string, activo: boolean): Promise<AgenteTrigger> {
    return this.update(id, { activo });
  },
};

// =====================================================
// EJECUCIONES
// =====================================================

export const ejecucionApi = {
  // Obtener ejecuciones de un agente
  async getByAgente(
    agenteId: string,
    limit: number = 50
  ): Promise<AgenteEjecucion[]> {
    const { data, error } = await supabase
      .from('agente_ejecuciones')
      .select('*')
      .eq('agente_id', agenteId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as AgenteEjecucion[];
  },

  // Obtener una ejecución específica
  async getById(id: string): Promise<AgenteEjecucion | null> {
    const { data, error } = await supabase
      .from('agente_ejecuciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as AgenteEjecucion;
  },

  // Ejecutar agente manualmente
  async execute(agenteId: string, input: any): Promise<AgenteEjecucion> {
    const response = await fetch(`${API_URL}/api/agentes/${agenteId}/ejecutar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error ejecutando agente');
    }

    return response.json();
  },
};

// =====================================================
// MÉTRICAS
// =====================================================

export const metricasApi = {
  // Obtener métricas de un agente
  async getByAgente(agenteId: string): Promise<AgenteMetricas> {
    const { data, error } = await supabase
      .rpc('calcular_metricas_agente', { agente_id: agenteId });

    if (error) {
      // Si la función no existe, calcular manualmente
      return this.calcularManual(agenteId);
    }

    return data as AgenteMetricas;
  },

  // Calcular métricas manualmente
  async calcularManual(agenteId: string): Promise<AgenteMetricas> {
    const ejecuciones = await ejecucionApi.getByAgente(agenteId, 1000);

    const total = ejecuciones.length;
    const exitosas = ejecuciones.filter((e) => e.status === 'completado').length;
    const fallidas = ejecuciones.filter((e) => e.status === 'error').length;
    const enProceso = ejecuciones.filter(
      (e) => e.status === 'procesando' || e.status === 'iniciado'
    ).length;

    const tasaExito = total > 0 ? (exitosas / total) * 100 : 0;

    const duraciones = ejecuciones
      .filter((e) => e.duracion_segundos)
      .map((e) => e.duracion_segundos!);
    const tiempoPromedio =
      duraciones.length > 0
        ? duraciones.reduce((a, b) => a + b, 0) / duraciones.length
        : 0;

    const tokensTotal = ejecuciones.reduce(
      (sum, e) => sum + (e.tokens_usados || 0),
      0
    );
    const costoTotal = ejecuciones.reduce(
      (sum, e) => sum + (e.costo_estimado || 0),
      0
    );

    return {
      agente_id: agenteId,
      total_ejecuciones: total,
      ejecuciones_exitosas: exitosas,
      ejecuciones_fallidas: fallidas,
      ejecuciones_en_proceso: enProceso,
      tasa_exito: Math.round(tasaExito),
      tiempo_promedio_segundos: Math.round(tiempoPromedio),
      tokens_totales: tokensTotal,
      costo_total: costoTotal,
      ultima_ejecucion: ejecuciones[0]?.created_at,
    };
  },

  // Obtener métricas de todos los agentes
  async getAll(): Promise<Record<string, AgenteMetricas>> {
    const agentes = await agenteApi.getAll();
    const metricas: Record<string, AgenteMetricas> = {};

    await Promise.all(
      agentes.map(async (agente) => {
        metricas[agente.id] = await this.getByAgente(agente.id);
      })
    );

    return metricas;
  },
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default {
  agentes: agenteApi,
  dependencias: dependenciaApi,
  triggers: triggerApi,
  ejecuciones: ejecucionApi,
  metricas: metricasApi,
};
