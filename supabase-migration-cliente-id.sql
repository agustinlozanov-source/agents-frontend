-- =====================================================
-- MIGRATION: Agregar cliente_id a proyectos
-- Ejecutar en: Supabase → SQL Editor
-- =====================================================

-- 1. Agregar columna cliente_id
ALTER TABLE proyectos
  ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL;

-- 2. Índice para joins rápidos
CREATE INDEX IF NOT EXISTS idx_proyectos_cliente_id ON proyectos(cliente_id);

-- 3. (Opcional) Backfill: enlazar proyectos existentes por nombre
--    Solo si tus clientes ya existen en la tabla clientes
-- UPDATE proyectos p
-- SET cliente_id = c.id
-- FROM clientes c
-- WHERE p.cliente = c.nombre
--   AND p.cliente_id IS NULL;
