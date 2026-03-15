"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Bot, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('Error al iniciar sesión', { description: error.message });
      setLoading(false);
    } else {
      toast.success('Sesión iniciada');
      router.push('/');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-accent-primary rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            Agentes Hub
          </span>
        </div>

        <div className="card">
          <h1 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
            Iniciar sesión
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
            ¿No tienes cuenta?{' '}
            <a href="/signup" className="text-accent-primary hover:underline font-medium">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
