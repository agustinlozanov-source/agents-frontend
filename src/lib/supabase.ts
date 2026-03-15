import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente principal — maneja sesión via cookies automáticamente (auth-helpers)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Cliente admin con service key — solo usar en Server Components / API routes
// Bypasea RLS, nunca exponer al cliente
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : createClient(supabaseUrl, supabaseAnonKey) // fallback a anon

// Tipos de la base de datos
export type Proyecto = {
  id: string
  nombre: string
  cliente: string | null
  tipo: 'landing' | 'app' | 'ecommerce' | 'custom' | null
  status: 'idea' | 'investigacion' | 'desarrollo' | 'completado' | 'pausado'
  carpeta_vps: string | null
  repo_github: string | null
  url_produccion: string | null
  created_at: string
  metadata: Record<string, any> | null
}

export type AgenteTarea = {
  id: string
  proyecto_id: string | null
  agente_tipo: 'investigacion' | 'programacion' | 'automatizacion' | 'auditor'
  input: string
  output: string | null
  status: 'pendiente' | 'procesando' | 'completado' | 'error'
  tiempo_ejecucion: string | null
  archivos_generados: string[] | null
  metadata: Record<string, any> | null
  created_at: string
}

export type Cliente = {
  id: string
  nombre: string
  email: string | null
  empresa: string | null
  telefono: string | null
  created_at: string
  metadata: Record<string, any> | null
}

export type AgenteSkill = {
  id: string
  agente_tipo: 'investigacion' | 'programacion' | 'automatizacion' | 'auditor'
  nombre: string
  prompt: string
  version: number
  activo: boolean
  metricas: Record<string, any> | null
  created_at: string
}

export type Log = {
  id: string
  nivel: 'info' | 'warning' | 'error'
  fuente: 'frontend' | 'railway' | 'vps'
  mensaje: string
  metadata: Record<string, any> | null
  created_at: string
}

// Helper para logs
export const logToSupabase = async (
  nivel: Log['nivel'],
  fuente: Log['fuente'],
  mensaje: string,
  metadata?: Record<string, any>
) => {
  const { error } = await supabase
    .from('logs')
    .insert({ nivel, fuente, mensaje, metadata })
  
  if (error) console.error('Error logging to Supabase:', error)
}
