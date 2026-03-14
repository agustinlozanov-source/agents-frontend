# Agentes Hub

Plataforma de gestión y entrenamiento de agentes autónomos de IA.

## Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons
- **Database:** Supabase (PostgreSQL)
- **Backend:** Railway (Node.js + Express)
- **Deploy:** Netlify (Frontend) + Railway (Backend)
- **VPS:** Hetzner (Agentes 24/7)

## Características

- 🤖 Gestión de agentes autónomos (Investigación, Programación, Automatización, Auditor)
- 📊 Dashboard con métricas en tiempo real
- 👥 Mini CRM para gestión de clientes
- 📁 Explorador de proyectos y archivos VPS
- 🎨 Editor de prompts/skills de agentes
- 🌓 Modo claro/oscuro (estilo Claude)
- 🔐 Panel de superadmin para configuración avanzada

## Setup Local

### 1. Clonar e instalar

\`\`\`bash
git clone [tu-repo]
cd agentes-hub
npm install
\`\`\`

### 2. Configurar variables de entorno

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edita `.env.local` con tus credenciales reales.

### 3. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto nuevo
3. En SQL Editor, ejecuta el schema:

\`\`\`sql
-- Ver schema en /docs/schema.sql
\`\`\`

4. Copia la URL y Anon Key a `.env.local`

### 4. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000)

## Deploy

### Frontend (Netlify)

1. Conecta tu repo en Netlify
2. Configura las env vars
3. Deploy automático en cada push a `main`

### Backend (Railway)

Ver `/backend/README.md`

## Estructura del Proyecto

\`\`\`
agentes-hub/
├── src/
│   ├── app/              # Rutas de Next.js
│   │   ├── page.tsx      # Dashboard
│   │   ├── proyectos/    # Gestión de proyectos
│   │   ├── agentes/      # Gestión de agentes
│   │   ├── clientes/     # Mini CRM
│   │   └── superadmin/   # Panel de admin
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades y Supabase client
│   └── styles/           # CSS global
├── public/               # Assets estáticos
└── docs/                 # Documentación
\`\`\`

## Design System

### Tipografía
- Font: system-ui, -apple-system, Inter

### Colores

**Light Mode:**
- Background: `#F5F5F0`
- Surface: `#FFFFFF`
- Border: `#E5E5E0`
- Accent: `#C47E5A`

**Dark Mode:**
- Background: `#1A1A1A`
- Surface: `#2D2D2D`
- Border: `#3D3D3D`
- Accent: `#D4956C`

### Iconos
- Lucide React

## Comandos Útiles

\`\`\`bash
npm run dev       # Desarrollo
npm run build     # Build producción
npm run start     # Servidor producción
npm run lint      # ESLint
\`\`\`

## Contribuir

1. Fork el repo
2. Crea una branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

MIT
