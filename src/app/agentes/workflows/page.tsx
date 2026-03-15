'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  Node,
  Edge,
  NodeTypes,
  NodeProps,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { agenteApi, dependenciaApi } from '@/lib/api-agentes';
import { AgenteNode } from '@/components/agentes/AgenteNode';
import type { Agente, AgenteDependencia } from '@/types/agente';
import { NIVEL_LABELS } from '@/types/agente';

// ─── Nodo visual de etiqueta de nivel ────────────────────────────────────────

function NivelLabelNodeComponent({ data }: NodeProps<{ label: string }>) {
  return (
    <div className="pointer-events-none select-none">
      <p className="text-xs font-bold uppercase tracking-widest text-light-text-tertiary dark:text-dark-text-tertiary">
        {data.label}
      </p>
    </div>
  );
}
const NivelLabelNode = memo(NivelLabelNodeComponent);

// ─── nodeTypes fuera del componente para evitar re-renders ───────────────────

const nodeTypes: NodeTypes = {
  agenteNode: AgenteNode,
  nivelLabel: NivelLabelNode,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildNodes(agentes: Agente[]): Node[] {
  const agentNodes: Node[] = agentes.map((agente) => ({
    id: agente.id,
    type: 'agenteNode',
    position: { x: agente.posicion?.x ?? 0, y: agente.posicion?.y ?? 0 },
    data: agente,
    draggable: true,
  }));

  // Etiquetas flotantes por nivel (una por cada nivel presente)
  const nivelesPresentes = Array.from(new Set(agentes.map((a) => a.nivel))).sort();
  const labelNodes: Node[] = nivelesPresentes.map((nivel) => {
    const agentesNivel = agentes.filter((a) => a.nivel === nivel);
    const minX = Math.min(...agentesNivel.map((a) => a.posicion?.x ?? 0));
    const primerY = agentesNivel[0]?.posicion?.y ?? 0;
    return {
      id: `nivel-label-${nivel}`,
      type: 'nivelLabel',
      position: { x: minX - 130, y: primerY + 10 },
      data: { label: `Nivel ${nivel} · ${NIVEL_LABELS[nivel as 1 | 2 | 3]}` },
      draggable: false,
      selectable: false,
      focusable: false,
    };
  });

  return [...labelNodes, ...agentNodes];
}

function buildEdges(deps: AgenteDependencia[]): Edge[] {
  return deps.map((dep) => ({
    id: dep.id,
    source: dep.agente_origen_id,
    target: dep.agente_destino_id,
    type: 'smoothstep',
    animated: dep.tipo === 'paralelo',
    style: { stroke: '#C47E5A', strokeWidth: 1.5, opacity: 0.7 },
    labelStyle: { fontSize: 9, fill: '#9B9B9B' },
    labelBgPadding: [4, 2] as [number, number],
    labelBgStyle: { fill: 'transparent' },
  }));
}

// ─── Panel de detalle del agente seleccionado ─────────────────────────────────

function AgenteDetailPanel({ agente, onClose }: { agente: Agente; onClose: () => void }) {
  return (
    <div className="absolute top-4 right-4 w-72 bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-light-border dark:border-dark-border overflow-hidden z-10">
      <div className="h-1 w-full" style={{ backgroundColor: agente.color }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{agente.icono}</span>
            <div>
              <p className="font-semibold text-sm text-light-text-primary dark:text-dark-text-primary leading-tight">
                {agente.nombre}
              </p>
              <p className="text-xs font-mono text-light-text-tertiary dark:text-dark-text-tertiary">
                {agente.rol}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {agente.descripcion && (
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3 leading-relaxed">
            {agente.descripcion}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary w-20">Modelo</span>
            <span className="text-xs font-mono text-light-text-primary dark:text-dark-text-primary truncate">
              {agente.modelo}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary w-20">Max tokens</span>
            <span className="text-xs text-light-text-primary dark:text-dark-text-primary">
              {agente.max_tokens?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary w-20">Temperatura</span>
            <span className="text-xs text-light-text-primary dark:text-dark-text-primary">
              {agente.temperatura}
            </span>
          </div>
        </div>

        {agente.skills && agente.skills.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1.5 font-medium">
              Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {agente.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-light-border dark:bg-dark-border text-light-text-secondary dark:text-dark-text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {agente.permisos?.apis && agente.permisos.apis.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1.5 font-medium">
              APIs permitidas
            </p>
            <div className="flex flex-wrap gap-1">
              {agente.permisos.apis.map((api) => (
                <span
                  key={api}
                  className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                  style={{
                    borderColor: `${agente.color}60`,
                    color: agente.color,
                    backgroundColor: `${agente.color}10`,
                  }}
                >
                  {api}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Canvas principal ─────────────────────────────────────────────────────────

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAgentes, setTotalAgentes] = useState(0);
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null);
  const { fitView } = useReactFlow();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [agentes, dependencias] = await Promise.all([
          agenteApi.getAll(),
          dependenciaApi.getAll(),
        ]);

        setTotalAgentes(agentes.length);
        setNodes(buildNodes(agentes));
        setEdges(buildEdges(dependencias));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando agentes');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setNodes, setEdges]);

  // Fit view después de cargar nodos
  useEffect(() => {
    if (!loading && nodes.length > 0) {
      setTimeout(() => fitView({ padding: 0.12, duration: 600 }), 100);
    }
  }, [loading, fitView, nodes.length]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (node.type === 'agenteNode') {
      setSelectedAgente((prev) => (prev?.id === node.id ? null : (node.data as Agente)));
    }
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedAgente(null);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Cargando agentes…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="text-center space-y-2">
          <p className="text-2xl">⚠️</p>
          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
            Error cargando el canvas
          </p>
          <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary font-mono">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#C47E5A', strokeWidth: 1.5 },
        }}
        className="bg-light-bg dark:bg-dark-bg"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#D5D5D0"
          className="dark:opacity-30"
        />

        <Controls
          className="!bg-white dark:!bg-dark-surface !border-light-border dark:!border-dark-border !rounded-xl !shadow-md"
          showInteractive={false}
        />

        <MiniMap
          nodeColor={(node) =>
            node.type === 'agenteNode' ? (node.data as Agente).color : 'transparent'
          }
          maskColor="rgba(245, 245, 240, 0.7)"
          className="!bg-white dark:!bg-dark-surface !border-light-border dark:!border-dark-border !rounded-xl !shadow-md"
        />

        {/* Panel superior */}
        <Panel position="top-left">
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-md border border-light-border dark:border-dark-border px-4 py-3 flex items-center gap-4">
            <div>
              <h1 className="font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
                Org Chart · Agentes
              </h1>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                {totalAgentes} agentes · {edges.length} conexiones
              </p>
            </div>
            <div className="h-8 w-px bg-light-border dark:bg-dark-border" />
            <div className="flex items-center gap-3">
              {([1, 2] as const).map((nivel) => (
                <div key={nivel} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: nivel === 1 ? '#1E40AF' : '#10B981',
                    }}
                  />
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {NIVEL_LABELS[nivel]}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => fitView({ padding: 0.12, duration: 600 })}
              className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-primary transition-colors px-2 py-1 rounded-lg hover:bg-light-border dark:hover:bg-dark-border"
            >
              ⊞ Fit view
            </button>
          </div>
        </Panel>
      </ReactFlow>

      {/* Panel de detalle */}
      {selectedAgente && (
        <AgenteDetailPanel
          agente={selectedAgente}
          onClose={() => setSelectedAgente(null)}
        />
      )}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function WorkflowsPage() {
  return (
    <div className="-m-6 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      <ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
