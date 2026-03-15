'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import type { Agente } from '@/types/agente';
import { NIVEL_LABELS, ESTADO_COLORS } from '@/types/agente';

function AgenteNodeComponent({ data, selected }: NodeProps<Agente>) {
  const nivelLabel = NIVEL_LABELS[data.nivel];
  const isCSuite = data.nivel === 1;

  return (
    <>
      {/* Handle entrada (top) — oculto para CEO que no recibe dependencias */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 10,
          height: 10,
          background: 'white',
          border: `2px solid ${data.color}`,
        }}
      />

      <div
        className="bg-white dark:bg-dark-surface rounded-xl overflow-hidden transition-all duration-200"
        style={{
          width: 200,
          boxShadow: selected
            ? `0 0 0 2px ${data.color}, 0 8px 24px ${data.color}30`
            : '0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        {/* Barra de color superior */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: data.color }}
        />

        <div className="p-3 space-y-2">
          {/* Icono + Estado */}
          <div className="flex items-center justify-between">
            <span className="text-2xl leading-none">{data.icono}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium leading-tight ${ESTADO_COLORS[data.estado]}`}
            >
              {data.estado}
            </span>
          </div>

          {/* Nombre */}
          <div>
            <p className="font-semibold text-sm leading-tight text-light-text-primary dark:text-dark-text-primary">
              {data.nombre}
            </p>
            <p className="text-[11px] text-light-text-tertiary dark:text-dark-text-tertiary font-mono mt-0.5">
              {data.rol}
            </p>
          </div>

          {/* Nivel badge */}
          <span
            className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium text-white leading-tight"
            style={{ backgroundColor: data.color }}
          >
            {isCSuite ? `Nivel 1 · ${nivelLabel}` : `Nivel ${data.nivel} · ${nivelLabel}`}
          </span>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {data.skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-light-border dark:bg-dark-border text-light-text-tertiary dark:text-dark-text-tertiary"
                >
                  {skill}
                </span>
              ))}
              {data.skills.length > 2 && (
                <span className="text-[10px] text-light-text-tertiary dark:text-dark-text-tertiary self-center">
                  +{data.skills.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Handle salida (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 10,
          height: 10,
          background: 'white',
          border: `2px solid ${data.color}`,
        }}
      />
    </>
  );
}

export const AgenteNode = memo(AgenteNodeComponent);
