"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Bot, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast.error('Error al registrarse', { description: error.message });
      setLoading(false);
    } else {
      toast.success('Cuenta creada', {
        description: 'Verifica tu email para continuar',
      });
      router.push('/login');
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
            Crear cuenta
          </h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                required
                placeholder="Juan Pérez"
                autoComplete="name"
              />
            </div>

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
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
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
                  Creando cuenta...
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-accent-primary hover:underline font-medium">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
