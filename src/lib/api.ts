import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'http://localhost:3001';

async function getUserContext() {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  let tenantId: string | null = null;
  if (userId) {
    try {
      const { data } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', userId)
        .single();
      tenantId = data?.tenant_id || null;
    } catch {
      // tenant_users puede no existir todavía
    }
  }

  return { userId, tenantId };
}

export const api = {
  // VPS
  async getVPSStatus() {
    const res = await fetch(`${API_URL}/api/vps/status`);
    return res.json();
  },

  async executeVPSCommand(command: string) {
    const res = await fetch(`${API_URL}/api/vps/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
    return res.json();
  },

  // Agentes
  async executeAgent(agente_tipo: string, input: string, proyecto_id?: string) {
    const { userId, tenantId } = await getUserContext();
    const res = await fetch(`${API_URL}/api/agentes/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agente_tipo, input, proyecto_id, created_by: userId, tenant_id: tenantId })
    });
    return res.json();
  },

  async getAgentesStatus() {
    const res = await fetch(`${API_URL}/api/agentes/status`);
    return res.json();
  },

  // Proyectos
  async getProyectos() {
    const res = await fetch(`${API_URL}/api/proyectos`);
    return res.json();
  },

  async createProyecto(data: any) {
    const { userId, tenantId } = await getUserContext();
    const res = await fetch(`${API_URL}/api/proyectos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, created_by: userId, tenant_id: tenantId })
    });
    return res.json();
  },
  async updateProyecto(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/proyectos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error actualizando proyecto");
    return res.json();
  },

  async deleteProyecto(id: string) {
    const res = await fetch(`${API_URL}/api/proyectos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error eliminando proyecto");
    return res.json();
  },
  async updateAgentSkill(id: string, prompt: string) {
    const res = await fetch(`${API_URL}/api/agentes/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return res.json();
  },

  // Clientes (directo a Supabase)
  async createCliente(data: Record<string, unknown>) {
    const { userId, tenantId } = await getUserContext();
    if (!userId) throw new Error('No autenticado');
    if (!tenantId) throw new Error('Usuario sin tenant asignado');

    const { data: cliente, error } = await supabase
      .from('clientes')
      .insert({ ...data, tenant_id: tenantId, created_by: userId })
      .select()
      .single();

    if (error) throw error;
    return cliente;
  },

  async getClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*, proyectos:proyectos(count)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async deleteCliente(id: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
