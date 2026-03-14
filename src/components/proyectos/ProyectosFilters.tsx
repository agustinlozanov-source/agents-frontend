"use client";

import { Search, Filter } from "lucide-react";

export function ProyectosFilters() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            className="input pl-10"
          />
        </div>

        {/* Filter by Status */}
        <select className="input md:w-48">
          <option value="">Todos los estados</option>
          <option value="idea">Idea</option>
          <option value="investigacion">Investigación</option>
          <option value="desarrollo">Desarrollo</option>
          <option value="completado">Completado</option>
          <option value="pausado">Pausado</option>
        </select>

        {/* Filter by Type */}
        <select className="input md:w-48">
          <option value="">Todos los tipos</option>
          <option value="landing">Landing Page</option>
          <option value="app">Aplicación Web</option>
          <option value="ecommerce">E-commerce</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>
    </div>
  );
}
