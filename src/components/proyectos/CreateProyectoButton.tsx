"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Loader2, Search, ChevronDown, X, User } from "lucide-react";
import { api } from "@/lib/api";
import { supabase, type Cliente } from "@/lib/supabase";
import { toast } from "sonner";

export function CreateProyectoButton({ onCreated }: { onCreated?: () => void } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [clienteSearch, setClienteSearch] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const comboRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "landing" as "landing" | "app" | "ecommerce" | "custom",
    repo_github: "",
    url_produccion: "",
    carpeta_vps: "",
  });

  // Cargar clientes al abrir el modal
  useEffect(() => {
    if (isOpen) loadClientes();
  }, [isOpen]);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setComboOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function loadClientes() {
    const { data } = await supabase
      .from("clientes")
      .select("*")
      .order("nombre");
    setClientes((data as Cliente[]) || []);
  }

  // Fuzzy filter: nombre o empresa contienen el texto
  const filtered = clientes.filter((c) => {
    const q = clienteSearch.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      (c.empresa?.toLowerCase().includes(q) ?? false)
    );
  });

  function resetForm() {
    setFormData({ nombre: "", tipo: "landing", repo_github: "", url_produccion: "", carpeta_vps: "" });
    setSelectedCliente(null);
    setClienteSearch("");
    setComboOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) {
      toast.error("Selecciona un cliente");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.createProyecto({
        ...formData,
        cliente: selectedCliente.nombre,
        cliente_id: selectedCliente.id,
      });
      toast.success("Proyecto creado", { duration: 5000 });
      resetForm();
      setIsOpen(false);
      onCreated?.();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error al crear proyecto", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Nuevo Proyecto
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Crear Nuevo Proyecto
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="input"
              required
              placeholder="Mi Proyecto Increíble"
            />
          </div>

          {/* Cliente — combobox con fuzzy search */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Cliente *
            </label>
            <div className="relative" ref={comboRef}>
              {/* Trigger */}
              <button
                type="button"
                onClick={() => { setComboOpen(!comboOpen); setClienteSearch(""); }}
                className="input flex items-center justify-between w-full text-left"
              >
                {selectedCliente ? (
                  <span className="flex items-center gap-2 text-light-text-primary dark:text-dark-text-primary">
                    <User className="w-4 h-4 text-accent-primary flex-shrink-0" />
                    <span className="truncate">{selectedCliente.nombre}</span>
                    {selectedCliente.empresa && (
                      <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                        · {selectedCliente.empresa}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-light-text-tertiary dark:text-dark-text-tertiary">
                    Selecciona un cliente
                  </span>
                )}
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {selectedCliente && (
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedCliente(null); setClienteSearch(""); }}
                      className="p-0.5 rounded hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary transition-transform duration-150 ${
                    comboOpen ? "rotate-180" : ""
                  }`} />
                </div>
              </button>

              {/* Dropdown */}
              {comboOpen && (
                <div className="absolute z-20 w-full mt-1 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg shadow-xl overflow-hidden">
                  {/* Search input */}
                  <div className="p-2 border-b border-light-border dark:border-dark-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                      <input
                        autoFocus
                        type="text"
                        value={clienteSearch}
                        onChange={(e) => setClienteSearch(e.target.value)}
                        placeholder="Buscar por nombre o empresa..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                      />
                    </div>
                  </div>

                  {/* Options list */}
                  <div className="max-h-44 overflow-y-auto">
                    {filtered.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary text-center">
                        {clientes.length === 0
                          ? "No hay clientes — crea uno primero"
                          : `Sin resultados para "${clienteSearch}"`}
                      </p>
                    ) : (
                      filtered.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => { setSelectedCliente(c); setComboOpen(false); setClienteSearch(""); }}
                          className={`w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors ${
                            selectedCliente?.id === c.id ? "bg-accent-primary/5" : ""
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-accent-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                              {c.nombre}
                            </p>
                            {c.empresa && (
                              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                                {c.empresa}
                              </p>
                            )}
                          </div>
                          {selectedCliente?.id === c.id && (
                            <span className="text-accent-primary font-bold text-sm flex-shrink-0">✓</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Tipo
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              className="input"
            >
              <option value="landing">Landing Page</option>
              <option value="app">Aplicación Web</option>
              <option value="ecommerce">E-commerce</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Repositorio GitHub */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Repositorio GitHub
            </label>
            <input
              type="url"
              value={formData.repo_github}
              onChange={(e) => setFormData({ ...formData, repo_github: e.target.value })}
              className="input"
              placeholder="https://github.com/usuario/repo"
            />
          </div>

          {/* URL Producción */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              URL de Producción
            </label>
            <input
              type="url"
              value={formData.url_produccion}
              onChange={(e) => setFormData({ ...formData, url_produccion: e.target.value })}
              className="input"
              placeholder="https://miproyecto.com"
            />
          </div>

          {/* Carpeta VPS */}
          <div>
            <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Carpeta en VPS
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary ml-2">(para deploy)</span>
            </label>
            <input
              type="text"
              value={formData.carpeta_vps}
              onChange={(e) => setFormData({ ...formData, carpeta_vps: e.target.value })}
              className="input"
              placeholder="mi-proyecto"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { resetForm(); setIsOpen(false); }}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isSubmitting || !selectedCliente}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Crear Proyecto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
