const API_URL = process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'http://localhost:3001';

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
    const res = await fetch(`${API_URL}/api/agentes/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agente_tipo, input, proyecto_id })
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
    const res = await fetch(`${API_URL}/api/proyectos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateAgentSkill(id: string, prompt: string) {
    const res = await fetch(`${API_URL}/api/agentes/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return res.json();
  }
};
