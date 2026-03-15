"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { MessageCircle, Check, X } from 'lucide-react';

export default function VincularTelegram() {
  const { user, tenantId } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [vinculando, setVinculando] = useState(false);
  const [vinculado, setVinculado] = useState(false);

  async function handleVincular(e: React.FormEvent) {
    e.preventDefault();
    
    if (!codigo || codigo.length !== 6) {
      toast.error('Código inválido', {
        description: 'Debe tener 6 dígitos',
      });
      return;
    }

    setVinculando(true);

    try {
      // Buscar telegram_user con ese código
      const { data: telegramUser, error: searchError } = await supabase
        .from('telegram_users')
        .select('*')
        .eq('link_code', codigo)
        .single();

      if (searchError || !telegramUser) {
        toast.error('Código no encontrado', {
          description: 'Verifica el código o genera uno nuevo en Telegram',
        });
        setVinculando(false);
        return;
      }

      // Verificar que no haya expirado
      const expiresAt = new Date(telegramUser.link_code_expires_at);
      if (expiresAt < new Date()) {
        toast.error('Código expirado', {
          description: 'Genera un nuevo código en Telegram con /start',
        });
        setVinculando(false);
        return;
      }

      // Vincular a tenant y usuario
      const { error: updateError } = await supabase
        .from('telegram_users')
        .update({
          tenant_id: tenantId,
          user_id: user?.id,
          link_code: null, // Limpiar código
          link_code_expires_at: null,
        })
        .eq('chat_id', telegramUser.chat_id);

      if (updateError) {
        toast.error('Error vinculando', {
          description: updateError.message,
        });
        setVinculando(false);
        return;
      }

      toast.success('Telegram vinculado', {
        description: 'Ahora puedes usar el bot',
      });
      
      setVinculado(true);
      setCodigo('');

    } catch (error: any) {
      toast.error('Error', {
        description: error.message,
      });
    }

    setVinculando(false);
  }

  return (
    <div className="card max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-accent-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Vincular Telegram</h2>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Conecta tu cuenta de Telegram
          </p>
        </div>
      </div>

      {vinculado ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-accent-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-accent-success" />
          </div>
          <h3 className="text-lg font-semibold mb-2">¡Vinculado correctamente!</h3>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Ya puedes usar el bot de Telegram
          </p>
          <button
            onClick={() => setVinculado(false)}
            className="btn btn-secondary"
          >
            Vincular otra cuenta
          </button>
        </div>
      ) : (
        <>
          <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">📱 Instrucciones:</h3>
            <ol className="text-sm space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
              <li>1. Abre Telegram y busca <code className="bg-light-surface dark:bg-dark-surface px-2 py-1 rounded">@agustin_agente_bot</code></li>
              <li>2. Envía el comando <code className="bg-light-surface dark:bg-dark-surface px-2 py-1 rounded">/start</code></li>
              <li>3. El bot te dará un código de 6 dígitos</li>
              <li>4. Ingresa ese código aquí abajo</li>
            </ol>
          </div>

          <form onSubmit={handleVincular} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Código de vinculación
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="input text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                required
              />
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-2">
                El código expira en 10 minutos
              </p>
            </div>

            <button
              type="submit"
              disabled={vinculando || codigo.length !== 6}
              className="btn btn-primary w-full"
            >
              {vinculando ? 'Vinculando...' : 'Vincular Telegram'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
