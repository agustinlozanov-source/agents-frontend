import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

// Merge de classNames con Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formateo de fechas
export function formatDate(date: string | Date, formatStr: string = "PPP") {
  return format(new Date(date), formatStr, { locale: es })
}

export function formatRelativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

// Status labels
export const statusLabels: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "text-light-text-tertiary dark:text-dark-text-tertiary" },
  investigacion: { label: "Investigación", color: "text-blue-600 dark:text-blue-400" },
  desarrollo: { label: "Desarrollo", color: "text-accent-warning" },
  completado: { label: "Completado", color: "text-accent-success" },
  pausado: { label: "Pausado", color: "text-light-text-secondary dark:text-dark-text-secondary" },
  pendiente: { label: "Pendiente", color: "text-light-text-tertiary dark:text-dark-text-tertiary" },
  procesando: { label: "Procesando", color: "text-accent-warning" },
  error: { label: "Error", color: "text-accent-error" },
}

// Tipo labels
export const tipoLabels: Record<string, string> = {
  landing: "Landing Page",
  app: "Aplicación Web",
  ecommerce: "E-commerce",
  custom: "Personalizado",
}

// Agente tipo labels
export const agenteLabels: Record<string, { label: string; icon: string }> = {
  // Legacy
  investigacion: { label: "Investigación", icon: "🔍" },
  programacion: { label: "Programación", icon: "💻" },
  automatizacion: { label: "Automatización", icon: "⚙️" },
  auditor: { label: "Auditor", icon: "📊" },
  // C-Suite
  ceo: { label: "CEO", icon: "🎯" },
  cfo: { label: "CFO", icon: "💰" },
  coo: { label: "COO", icon: "⚙️" },
  cto: { label: "CTO", icon: "🔬" },
  cmo: { label: "CMO", icon: "📢" },
  // Líderes
  lider_investigacion: { label: "Líder de Investigación", icon: "🔬" },
  lider_innovacion: { label: "Líder de Innovación", icon: "💡" },
  lider_data: { label: "Líder de Data", icon: "📈" },
  lider_diseno: { label: "Líder de Diseño", icon: "🎨" },
  lider_marketing_digital: { label: "Líder de Marketing Digital", icon: "📱" },
  lider_infraestructura: { label: "Líder de Infraestructura", icon: "🏗️" },
  lider_seguridad: { label: "Líder de Seguridad", icon: "🔒" },
  lider_finanzas: { label: "Líder de Finanzas", icon: "💵" },
  lider_qa: { label: "Líder de QA", icon: "🧪" },
  lider_programacion: { label: "Líder de Programación", icon: "💻" },
  lider_auditorias: { label: "Líder de Auditorías", icon: "📊" },
}

// Copiar al clipboard
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy:", err)
    return false
  }
}

// Generar ID único
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Truncar texto
export function truncate(text: string, length: number = 100) {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}
