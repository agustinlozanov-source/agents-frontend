-- =====================================================
-- MIGRATION: Auto-tenant system
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Tabla tenants (si no existe)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla tenant_users (si no existe)
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  rol TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- 3. Función: crear tenant automático al registrar usuario
CREATE OR REPLACE FUNCTION handle_new_user_tenant()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  INSERT INTO tenants (nombre)
  VALUES (NEW.email)
  RETURNING id INTO new_tenant_id;

  INSERT INTO tenant_users (user_id, tenant_id, rol)
  VALUES (NEW.id, new_tenant_id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_tenant ON auth.users;
CREATE TRIGGER on_auth_user_created_tenant
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_tenant();

-- 5. Backfill: crear tenant para usuarios existentes sin tenant
DO $$
DECLARE
  u RECORD;
  new_tenant_id UUID;
BEGIN
  FOR u IN
    SELECT id, email FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM tenant_users)
  LOOP
    INSERT INTO tenants (nombre)
    VALUES (u.email)
    RETURNING id INTO new_tenant_id;

    INSERT INTO tenant_users (user_id, tenant_id, rol)
    VALUES (u.id, new_tenant_id, 'owner');
  END LOOP;
END;
$$;

-- Verificar resultado
SELECT 
  u.email,
  tu.tenant_id,
  tu.rol
FROM auth.users u
JOIN tenant_users tu ON tu.user_id = u.id;
