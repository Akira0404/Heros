import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Perfil() {
  const { usuario } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, [usuario]);

  const mutPerfil = useMutation({
    mutationFn: (dados) => api.put('/auth/perfil', dados),
    onSuccess: () => toast.success('Perfil atualizado!'),
    onError: () => toast.error('Erro ao atualizar perfil'),
  });

  const mutSenha = useMutation({
    mutationFn: (dados) => api.put('/auth/senha', dados),
    onSuccess: () => {
      toast.success('Senha alterada!');
      setSenhaAtual('');
      setNovaSenha('');
    },
    onError: (err) => toast.error(err.response?.data?.erro || 'Erro ao alterar senha'),
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold text-white mb-8">Configurações de Perfil</h1>

          {/* Dados pessoais */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutPerfil.mutate({ nome, email });
            }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-5"
          >
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
              Dados Pessoais
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={mutPerfil.isPending}
              className="mt-5 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {mutPerfil.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

          {/* Alterar senha */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutSenha.mutate({ senhaAtual, novaSenha });
            }}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6"
          >
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
              Alterar Senha
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Senha Atual</label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Nova Senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={mutSenha.isPending}
              className="mt-5 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {mutSenha.isPending ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}