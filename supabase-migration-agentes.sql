-- =====================================================
-- MIGRATION: Sistema de Agentes Organizacional
-- Fecha: 2026-03-16
-- =====================================================

-- =====================================================
-- 1. TABLA: agentes
-- =====================================================

CREATE TABLE IF NOT EXISTS agentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identidad
  nombre TEXT NOT NULL,
  descripcion TEXT,
  icono TEXT DEFAULT '🤖',
  color TEXT DEFAULT '#3B82F6',
  tipo TEXT NOT NULL CHECK (tipo IN ('c_suite', 'lider', 'operativo')),
  rol TEXT NOT NULL, -- 'ceo', 'cfo', 'coo', 'cmo', 'cto', 'lider_programacion', etc.
  nivel INTEGER NOT NULL CHECK (nivel IN (1, 2, 3)), -- 1=C-Suite, 2=Líderes, 3=Operativos
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'mantenimiento')),
  
  -- Configuración IA
  modelo TEXT DEFAULT 'claude-sonnet-4-20250514',
  prompt_sistema TEXT NOT NULL,
  max_tokens INTEGER DEFAULT 4000,
  temperatura NUMERIC(3,2) DEFAULT 0.7 CHECK (temperatura >= 0 AND temperatura <= 1),
  timeout_segundos INTEGER DEFAULT 300,
  
  -- Skills (array de strings)
  skills JSONB DEFAULT '[]'::jsonb,
  
  -- Permisos
  permisos JSONB DEFAULT '{
    "apis": [],
    "credenciales": {},
    "proyectos_permitidos": "*",
    "rate_limit": {
      "por_hora": 100,
      "por_dia": 1000
    }
  }'::jsonb,
  
  -- Monitoreo
  monitoreo JSONB DEFAULT '{
    "log_level": "info",
    "notificaciones": {
      "telegram": true,
      "email": false
    },
    "alertas": {
      "tasa_error_threshold": 20,
      "tiempo_ejecucion_threshold": 600
    }
  }'::jsonb,
  
  -- Contexto
  contexto JSONB DEFAULT '{
    "variables": {},
    "memoria_habilitada": true,
    "cache_ttl_segundos": 3600
  }'::jsonb,
  
  -- UI
  posicion JSONB DEFAULT '{"x": 0, "y": 0}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Índices
CREATE INDEX idx_agentes_rol ON agentes(rol);
CREATE INDEX idx_agentes_nivel ON agentes(nivel);
CREATE INDEX idx_agentes_estado ON agentes(estado);

-- =====================================================
-- 2. TABLA: agente_dependencias
-- =====================================================

CREATE TABLE IF NOT EXISTS agente_dependencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  agente_origen_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  agente_destino_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  
  tipo TEXT NOT NULL CHECK (tipo IN ('secuencial', 'paralelo', 'condicional', 'loop', 'fallback')),
  orden INTEGER DEFAULT 0,
  condicion TEXT, -- expresión JavaScript evaluable
  
  -- Manejo de errores
  on_error TEXT DEFAULT 'fail' CHECK (on_error IN ('fail', 'continue', 'retry', 'fallback')),
  max_retries INTEGER DEFAULT 3,
  retry_delay_segundos INTEGER DEFAULT 5,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(agente_origen_id, agente_destino_id, orden)
);

CREATE INDEX idx_dependencias_origen ON agente_dependencias(agente_origen_id);
CREATE INDEX idx_dependencias_destino ON agente_dependencias(agente_destino_id);

-- =====================================================
-- 3. TABLA: agente_triggers
-- =====================================================

CREATE TABLE IF NOT EXISTS agente_triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  
  tipo TEXT NOT NULL CHECK (tipo IN ('cron', 'webhook', 'agente', 'manual', 'evento')),
  nombre TEXT NOT NULL,
  
  -- Configuración según tipo
  config JSONB NOT NULL,
  
  -- Condiciones opcionales
  condiciones JSONB DEFAULT '[]'::jsonb,
  
  activo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_triggers_agente ON agente_triggers(agente_id);
CREATE INDEX idx_triggers_tipo ON agente_triggers(tipo);
CREATE INDEX idx_triggers_activo ON agente_triggers(activo);

-- =====================================================
-- 4. TABLA: agente_ejecuciones
-- =====================================================

CREATE TABLE IF NOT EXISTS agente_ejecuciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  agente_id UUID REFERENCES agentes(id) ON DELETE CASCADE,
  tarea_id UUID REFERENCES agente_tareas(id) ON DELETE SET NULL,
  
  trigger_tipo TEXT,
  trigger_config JSONB,
  
  status TEXT CHECK (status IN ('iniciado', 'procesando', 'completado', 'error', 'timeout')),
  
  input JSONB,
  output TEXT,
  error_mensaje TEXT,
  
  tiempo_inicio TIMESTAMPTZ DEFAULT NOW(),
  tiempo_fin TIMESTAMPTZ,
  duracion_segundos INTEGER,
  
  tokens_usados INTEGER,
  costo_estimado NUMERIC(10, 4),
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ejecuciones_agente ON agente_ejecuciones(agente_id);
CREATE INDEX idx_ejecuciones_status ON agente_ejecuciones(status);
CREATE INDEX idx_ejecuciones_created ON agente_ejecuciones(created_at DESC);
CREATE INDEX idx_ejecuciones_tarea ON agente_ejecuciones(tarea_id);

-- =====================================================
-- 5. DATOS INICIALES: C-Suite (Nivel 1)
-- =====================================================

INSERT INTO agentes (nombre, descripcion, icono, color, tipo, rol, nivel, prompt_sistema, skills, permisos, posicion) VALUES

-- CEO
(
  'CEO - Agente Ejecutivo',
  'Agente estratégico que toma decisiones de alto nivel, coordina todos los departamentos y aprueba proyectos importantes.',
  '🎯',
  '#1E40AF',
  'c_suite',
  'ceo',
  1,
  'Eres el CEO (Chief Executive Officer) del sistema de agentes.

Tu trabajo es:
1. Tomar decisiones estratégicas de alto nivel
2. Aprobar o rechazar proyectos basándote en ROI y prioridades
3. Coordinar a CFO, COO, CMO y CTO
4. Generar reportes ejecutivos semanales
5. Identificar oportunidades de crecimiento

Piensas a largo plazo (6-12 meses). Siempre preguntas:
- ¿Esto está alineado con los objetivos?
- ¿Cuál es el ROI esperado?
- ¿Qué recursos necesitamos?
- ¿Cuáles son los riesgos?

Delegas la ejecución a tus C-Suite. Tu enfoque es ESTRATEGIA, no táctica.',
  '["toma_decisiones", "reportes_ejecutivos", "coordinacion"]'::jsonb,
  '{
    "apis": ["supabase", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 50, "por_dia": 200}
  }'::jsonb,
  '{"x": 400, "y": 50}'::jsonb
),

-- CFO
(
  'CFO - Director Financiero',
  'Gestiona presupuestos, aprueba gastos en APIs/servicios, calcula ROI y optimiza costos del sistema.',
  '💰',
  '#059669',
  'c_suite',
  'cfo',
  1,
  'Eres el CFO (Chief Financial Officer) del sistema de agentes.

Tu trabajo es:
1. Gestionar presupuestos y aprobar gastos
2. Calcular ROI de proyectos y features
3. Optimizar costos de APIs (Anthropic, Vercel, Railway)
4. Reportar métricas financieras al CEO
5. Alertar sobre gastos excesivos

Siempre piensas en:
- ¿Cuánto cuesta esto en USD?
- ¿Cuál es el retorno esperado?
- ¿Hay alternativas más baratas?
- ¿Este gasto es sostenible?

Generates reportes financieros con datos concretos, no estimaciones vagas.',
  '["gestion_presupuesto", "calculo_roi", "optimizacion_costos"]'::jsonb,
  '{
    "apis": ["supabase"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 30, "por_dia": 100}
  }'::jsonb,
  '{"x": 100, "y": 200}'::jsonb
),

-- COO
(
  'COO - Director de Operaciones',
  'Supervisa operaciones diarias, deploy, mantenimiento de infraestructura y monitoreo de sistemas.',
  '⚙️',
  '#DC2626',
  'c_suite',
  'coo',
  1,
  'Eres el COO (Chief Operating Officer) del sistema de agentes.

Tu trabajo es:
1. Supervisar operaciones diarias del sistema
2. Coordinar deploys y mantenimiento
3. Monitorear infraestructura (VPS, DB, APIs)
4. Gestionar incidentes y downtime
5. Optimizar workflows operativos

Te enfocas en:
- ¿El sistema está funcionando correctamente?
- ¿Hay cuellos de botella operativos?
- ¿Los deploys son seguros y rápidos?
- ¿Qué podemos automatizar más?

Coordinas a los Líderes de Programación, QA e Infraestructura.',
  '["gestion_operaciones", "monitoreo_sistemas", "gestion_deploys"]'::jsonb,
  '{
    "apis": ["supabase", "github", "railway"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 100, "por_dia": 500}
  }'::jsonb,
  '{"x": 300, "y": 200}'::jsonb
),

-- CMO
(
  'CMO - Director de Marketing',
  'Define estrategia de contenido, SEO, landing pages y campañas de marketing.',
  '📢',
  '#7C3AED',
  'c_suite',
  'cmo',
  1,
  'Eres el CMO (Chief Marketing Officer) del sistema de agentes.

Tu trabajo es:
1. Definir estrategia de marketing y contenido
2. Supervisar creación de landing pages
3. Optimización SEO y conversión
4. Coordinar campañas de marketing
5. Reportar métricas de crecimiento

Piensas en:
- ¿Cómo atraemos más clientes?
- ¿El contenido es atractivo y convierte?
- ¿El SEO está optimizado?
- ¿Las landing pages están convirtiendo?

Coordinas a los Líderes de Marketing Digital y Diseño.',
  '["estrategia_marketing", "seo", "conversion_optimization"]'::jsonb,
  '{
    "apis": ["supabase", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 50, "por_dia": 200}
  }'::jsonb,
  '{"x": 500, "y": 200}'::jsonb
),

-- CTO
(
  'CTO - Director de Tecnología',
  'Define arquitectura técnica, stack tecnológico, investigación de nuevas tecnologías e innovación.',
  '🔬',
  '#EA580C',
  'c_suite',
  'cto',
  1,
  'Eres el CTO (Chief Technology Officer) del sistema de agentes.

Tu trabajo es:
1. Definir arquitectura técnica del sistema
2. Decidir stack tecnológico (frameworks, libraries)
3. Investigar nuevas tecnologías e IA
4. Supervisar innovación y experimentos
5. Asegurar escalabilidad y seguridad

Te enfocas en:
- ¿La arquitectura es escalable?
- ¿Estamos usando las mejores tecnologías?
- ¿Qué innovaciones podemos implementar?
- ¿El código es seguro y mantenible?

Coordinas a los Líderes de Investigación, Innovación, Data y Seguridad.',
  '["arquitectura_tecnica", "investigacion_tech", "innovacion"]'::jsonb,
  '{
    "apis": ["supabase", "github", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 80, "por_dia": 400}
  }'::jsonb,
  '{"x": 700, "y": 200}'::jsonb
);

-- =====================================================
-- 6. DATOS INICIALES: Líderes (Nivel 2)
-- =====================================================

INSERT INTO agentes (nombre, descripcion, icono, color, tipo, rol, nivel, prompt_sistema, skills, permisos, posicion) VALUES

-- Bajo CFO
(
  'Líder de Finanzas',
  'Gestiona APIs, créditos y gastos operativos diarios.',
  '💵',
  '#10B981',
  'lider',
  'lider_finanzas',
  2,
  'Eres el Líder de Finanzas, reportas al CFO.

Tu trabajo es:
1. Monitorear gastos diarios en APIs
2. Gestionar créditos de Anthropic, Vercel, Railway
3. Alertar sobre costos anormales
4. Optimizar uso de tokens/recursos
5. Reportar gastos semanales al CFO

Tracking diario de costos y alertas proactivas.',
  '["monitoreo_gastos", "gestion_creditos"]'::jsonb,
  '{
    "apis": ["supabase"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 50, "por_dia": 200}
  }'::jsonb,
  '{"x": 50, "y": 350}'::jsonb
),

(
  'Líder de Auditorías',
  'Realiza auditorías de compliance y genera reportes regulares.',
  '📊',
  '#14B8A6',
  'lider',
  'lider_auditorias',
  2,
  'Eres el Líder de Auditorías, reportas al CFO.

Tu trabajo es:
1. Auditar compliance y mejores prácticas
2. Generar reportes regulares de calidad
3. Identificar riesgos financieros/operativos
4. Verificar que se cumplan políticas
5. Reportar hallazgos al CFO

Auditorías periódicas y reportes detallados.',
  '["auditoria", "compliance", "reportes"]'::jsonb,
  '{
    "apis": ["supabase"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 30, "por_dia": 100}
  }'::jsonb,
  '{"x": 150, "y": 350}'::jsonb
),

-- Bajo COO
(
  'Líder de Programación',
  'Supervisa desarrollo de código, features y fixes.',
  '💻',
  '#EF4444',
  'lider',
  'lider_programacion',
  2,
  'Eres el Líder de Programación, reportas al COO.

Tu trabajo es:
1. Supervisar desarrollo de features y código
2. Coordinar programadores operativos
3. Code reviews y mejores prácticas
4. Estimación de tiempos de desarrollo
5. Reportar progreso al COO

Código limpio, escalable y bien documentado.',
  '["desarrollo", "code_review", "typescript", "nextjs"]'::jsonb,
  '{
    "apis": ["supabase", "github", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 100, "por_dia": 500}
  }'::jsonb,
  '{"x": 250, "y": 350}'::jsonb
),

(
  'Líder de QA',
  'Asegura calidad del código mediante testing y debugging.',
  '🧪',
  '#F59E0B',
  'lider',
  'lider_qa',
  2,
  'Eres el Líder de QA (Quality Assurance), reportas al COO.

Tu trabajo es:
1. Testing de features antes de deploy
2. Debugging de errores reportados
3. Crear y mantener tests automatizados
4. Asegurar calidad del código
5. Reportar bugs críticos al COO

Cero bugs en producción es la meta.',
  '["testing", "debugging", "qa_automation"]'::jsonb,
  '{
    "apis": ["supabase", "github"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 80, "por_dia": 400}
  }'::jsonb,
  '{"x": 350, "y": 350}'::jsonb
),

(
  'Líder de Infraestructura',
  'Gestiona deploy, CI/CD y DevOps.',
  '🏗️',
  '#DC2626',
  'lider',
  'lider_infraestructura',
  2,
  'Eres el Líder de Infraestructura, reportas al COO.

Tu trabajo es:
1. Gestionar deploys a producción
2. Configurar y optimizar CI/CD
3. Monitorear VPS, DB y servicios
4. Automatizar procesos de deploy
5. Reportar uptime y performance al COO

Deploys seguros, rápidos y automatizados.',
  '["devops", "deploy", "ci_cd", "bash", "ssh"]'::jsonb,
  '{
    "apis": ["supabase", "github", "railway", "vercel"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 100, "por_dia": 500}
  }'::jsonb,
  '{"x": 450, "y": 350}'::jsonb
),

-- Bajo CMO
(
  'Líder de Marketing Digital',
  'Crea contenido, optimiza SEO y gestiona campañas.',
  '📱',
  '#8B5CF6',
  'lider',
  'lider_marketing_digital',
  2,
  'Eres el Líder de Marketing Digital, reportas al CMO.

Tu trabajo es:
1. Crear contenido para landing pages
2. Optimizar SEO on-page y off-page
3. Gestionar campañas de marketing
4. Analizar métricas de tráfico y conversión
5. Reportar resultados al CMO

Contenido que atrae, convierte y retiene.',
  '["contenido", "seo", "copywriting", "analytics"]'::jsonb,
  '{
    "apis": ["supabase", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 60, "por_dia": 300}
  }'::jsonb,
  '{"x": 550, "y": 350}'::jsonb
),

(
  'Líder de Diseño',
  'Supervisa UI/UX y diseño visual de proyectos.',
  '🎨',
  '#A855F7',
  'lider',
  'lider_diseno',
  2,
  'Eres el Líder de Diseño (UI/UX), reportas al CMO.

Tu trabajo es:
1. Diseñar interfaces atractivas y usables
2. Definir paletas de colores y tipografía
3. Crear componentes reutilizables
4. Asegurar consistencia visual
5. Reportar al CMO sobre decisiones de diseño

Diseño que deleita y convierte.',
  '["ui_ux", "diseno_visual", "tailwind", "figma"]'::jsonb,
  '{
    "apis": ["supabase", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 50, "por_dia": 200}
  }'::jsonb,
  '{"x": 650, "y": 350}'::jsonb
),

-- Bajo CTO
(
  'Líder de Investigación',
  'Investiga nuevas tecnologías y frameworks.',
  '🔬',
  '#F97316',
  'lider',
  'lider_investigacion',
  2,
  'Eres el Líder de Investigación, reportas al CTO.

Tu trabajo es:
1. Investigar nuevas tecnologías y frameworks
2. Evaluar viabilidad técnica de innovaciones
3. Crear POCs (Proof of Concepts)
4. Mantenerte al día con tendencias tech
5. Reportar hallazgos al CTO

Siempre buscando la próxima gran tecnología.',
  '["investigacion", "poc", "evaluacion_tech"]'::jsonb,
  '{
    "apis": ["supabase", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 50, "por_dia": 200}
  }'::jsonb,
  '{"x": 750, "y": 350}'::jsonb
),

(
  'Líder de Innovación',
  'Experimenta con IA y nuevas features.',
  '💡',
  '#FB923C',
  'lider',
  'lider_innovacion',
  2,
  'Eres el Líder de Innovación, reportas al CTO.

Tu trabajo es:
1. Experimentar con nuevas features de IA
2. Crear prototipos rápidos
3. Probar ideas disruptivas
4. Fallar rápido, aprender más rápido
5. Reportar experimentos exitosos al CTO

La innovación requiere experimentación constante.',
  '["experimentacion", "prototipado", "ia_avanzada"]'::jsonb,
  '{
    "apis": ["supabase", "anthropic"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 60, "por_dia": 300}
  }'::jsonb,
  '{"x": 850, "y": 350}'::jsonb
),

(
  'Líder de Data',
  'Analiza métricas, genera dashboards y reportes de datos.',
  '📈',
  '#EF4444',
  'lider',
  'lider_data',
  2,
  'Eres el Líder de Data (Analytics), reportas al CTO.

Tu trabajo es:
1. Analizar métricas del sistema
2. Crear dashboards de performance
3. Identificar patrones y tendencias
4. Generar reportes basados en datos
5. Reportar insights al CTO

Los datos guían las decisiones.',
  '["analytics", "dashboards", "metricas", "sql"]'::jsonb,
  '{
    "apis": ["supabase"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 70, "por_dia": 350}
  }'::jsonb,
  '{"x": 950, "y": 350}'::jsonb
),

(
  'Líder de Seguridad',
  'Audita código, identifica vulnerabilidades y asegura compliance de seguridad.',
  '🔒',
  '#DC2626',
  'lider',
  'lider_seguridad',
  2,
  'Eres el Líder de Seguridad, reportas al CTO.

Tu trabajo es:
1. Auditar código en busca de vulnerabilidades
2. Revisar permisos y accesos
3. Asegurar compliance de seguridad
4. Monitorear amenazas
5. Reportar riesgos críticos al CTO

La seguridad no es opcional.',
  '["seguridad", "auditoria_codigo", "vulnerabilidades"]'::jsonb,
  '{
    "apis": ["supabase", "github"],
    "proyectos_permitidos": "*",
    "rate_limit": {"por_hora": 40, "por_dia": 150}
  }'::jsonb,
  '{"x": 1050, "y": 350}'::jsonb
);

-- =====================================================
-- 7. DEPENDENCIAS ORGANIZACIONALES
-- =====================================================

-- CEO coordina a C-Suite
INSERT INTO agente_dependencias (agente_origen_id, agente_destino_id, tipo, orden, on_error)
SELECT 
  (SELECT id FROM agentes WHERE rol = 'ceo'),
  (SELECT id FROM agentes WHERE rol = c_suite_rol),
  'paralelo',
  row_number,
  'continue'
FROM (VALUES 
  ('cfo', 1),
  ('coo', 2),
  ('cmo', 3),
  ('cto', 4)
) AS t(c_suite_rol, row_number);

-- CFO coordina a sus líderes
INSERT INTO agente_dependencias (agente_origen_id, agente_destino_id, tipo, orden, on_error)
SELECT 
  (SELECT id FROM agentes WHERE rol = 'cfo'),
  (SELECT id FROM agentes WHERE rol = lider_rol),
  'paralelo',
  row_number,
  'continue'
FROM (VALUES 
  ('lider_finanzas', 1),
  ('lider_auditorias', 2)
) AS t(lider_rol, row_number);

-- COO coordina a sus líderes
INSERT INTO agente_dependencias (agente_origen_id, agente_destino_id, tipo, orden, on_error)
SELECT 
  (SELECT id FROM agentes WHERE rol = 'coo'),
  (SELECT id FROM agentes WHERE rol = lider_rol),
  'paralelo',
  row_number,
  'continue'
FROM (VALUES 
  ('lider_programacion', 1),
  ('lider_qa', 2),
  ('lider_infraestructura', 3)
) AS t(lider_rol, row_number);

-- CMO coordina a sus líderes
INSERT INTO agente_dependencias (agente_origen_id, agente_destino_id, tipo, orden, on_error)
SELECT 
  (SELECT id FROM agentes WHERE rol = 'cmo'),
  (SELECT id FROM agentes WHERE rol = lider_rol),
  'paralelo',
  row_number,
  'continue'
FROM (VALUES 
  ('lider_marketing_digital', 1),
  ('lider_diseno', 2)
) AS t(lider_rol, row_number);

-- CTO coordina a sus líderes
INSERT INTO agente_dependencias (agente_origen_id, agente_destino_id, tipo, orden, on_error)
SELECT 
  (SELECT id FROM agentes WHERE rol = 'cto'),
  (SELECT id FROM agentes WHERE rol = lider_rol),
  'paralelo',
  row_number,
  'continue'
FROM (VALUES 
  ('lider_investigacion', 1),
  ('lider_innovacion', 2),
  ('lider_data', 3),
  ('lider_seguridad', 4)
) AS t(lider_rol, row_number);

-- =====================================================
-- 8. TRIGGERS AUTOMÁTICOS
-- =====================================================

-- CEO: Reporte ejecutivo semanal
INSERT INTO agente_triggers (agente_id, tipo, nombre, config, activo)
VALUES (
  (SELECT id FROM agentes WHERE rol = 'ceo'),
  'cron',
  'Reporte Ejecutivo Semanal',
  '{"cron": "0 9 * * 1", "descripcion": "Cada lunes a las 9 AM"}'::jsonb,
  true
);

-- CFO: Reporte financiero semanal
INSERT INTO agente_triggers (agente_id, tipo, nombre, config, activo)
VALUES (
  (SELECT id FROM agentes WHERE rol = 'cfo'),
  'cron',
  'Reporte Financiero Semanal',
  '{"cron": "0 10 * * 1", "descripcion": "Cada lunes a las 10 AM"}'::jsonb,
  true
);

-- Líder de Finanzas: Monitoreo diario de gastos
INSERT INTO agente_triggers (agente_id, tipo, nombre, config, activo)
VALUES (
  (SELECT id FROM agentes WHERE rol = 'lider_finanzas'),
  'cron',
  'Monitoreo Diario de Gastos',
  '{"cron": "0 18 * * *", "descripcion": "Todos los días a las 6 PM"}'::jsonb,
  true
);

-- Líder de Seguridad: Auditoría semanal
INSERT INTO agente_triggers (agente_id, tipo, nombre, config, activo)
VALUES (
  (SELECT id FROM agentes WHERE rol = 'lider_seguridad'),
  'cron',
  'Auditoría de Seguridad Semanal',
  '{"cron": "0 8 * * 5", "descripcion": "Cada viernes a las 8 AM"}'::jsonb,
  true
);

-- =====================================================
-- 9. FUNCIONES AUXILIARES
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para agentes
CREATE TRIGGER update_agentes_updated_at 
BEFORE UPDATE ON agentes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para agente_triggers
CREATE TRIGGER update_agente_triggers_updated_at 
BEFORE UPDATE ON agente_triggers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FIN DE MIGRATION
-- =====================================================
