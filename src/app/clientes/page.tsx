"use client";

import { useEffect, useState } from "react";
import { supabase, type Cliente } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Users, Plus, Building } from "lucide-react";
import { CreateClienteButton } from "@/components/clientes/CreateClienteButton";
import { ClienteCard } from "@/components/clientes/ClienteCard";

export default function ClientesPage() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<(Cliente & { proyectos: { count: number }[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadClientes();
  }, [user]);

  async function loadClientes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select(`*, proyectos:proyectos(count)`)
      .order("created_at", { ascending: false });
    if (error) console.error("Error fetching clientes:", error);
    setClientes((data as (Cliente & { proyectos: { count: number }[] })[]) || []);
    setLoading(false);
  }

  const totalProyectos = clientes.reduce(
    (sum, c) => sum + (c.proyectos?.[0]?.count || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Clientes
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
              Gestiona tu cartera de clientes
            </p>
          </div>
        </div>

        <CreateClienteButton onCreated={loadClientes} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-accent-primary" />
            <div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Total Clientes
              </div>
              <div className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                {clientes.length}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Building className="w-8 h-8 text-accent-success" />
            <div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Con Proyectos
              </div>
              <div className="text-2xl font-semibold text-accent-success">
                {clientes.filter(c => (c.proyectos?.[0]?.count || 0) > 0).length}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Plus className="w-8 h-8 text-accent-warning" />
            <div>
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Total Proyectos
              </div>
              <div className="text-2xl font-semibold text-accent-warning">
                {totalProyectos}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clientes List */}
      {clientes.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-light-text-tertiary dark:text-dark-text-tertiary opacity-50" />
          <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            No hay clientes todavía
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
            Agrega tu primer cliente para empezar
          </p>
          <CreateClienteButton onCreated={loadClientes} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientes.map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              proyectosCount={cliente.proyectos?.[0]?.count || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
