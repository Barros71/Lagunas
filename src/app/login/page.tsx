"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      // success -> redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError((err as any)?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded shadow w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Entrar</h2>
        <label className="block mb-2">
          <span className="text-sm">Nome</span>
          <input id="name" name="name" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border rounded bg-input text-foreground" placeholder="Seu nome" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Senha</span>
          <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded bg-input text-foreground" placeholder="Senha" />
        </label>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button type="submit" disabled={loading} className="w-full bg-sky-600 text-white p-2 rounded">{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
