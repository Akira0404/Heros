import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import Navbar from '../components/Navbar';

export default function Guildas() {
  const queryClient = useQueryClient();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nome, setNome] = useState('');

  const { data: guildas = [], isLoading } = useQuery({
    queryKey: ['guildas-usuario'],
    queryFn: async () => {
      const { data } = await api.get('/guildas');
      return data;
    },
  });

  const mutCriar = useMutation({
    mutationFn: (dados) => api.post('/guildas', dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guildas-usuario'] });
      queryClient.invalidateQueries({ queryKey: ['guildas'] });
      toast.success('Guilda criada com sucesso!');
      setNome('');
      setMostrarForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.erro || 'Erro ao criar guilda'),
  });

  function handleSubmit(e) {
    e.preventDefault();
    mutCriar.mutate({ nome });
  }

  const cores = [
    'from-cyan-500 to-blue-600',
    'from-amber-400 to-orange-600',
    'from-emerald-400 to-green-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-sky-400 to-indigo-600',
    'from-lime-400 to-emerald-600',
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-extrabold text-white"
            >
              Guildas
            </motion.h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie suas guildas e veja seus heróis</p>
          </div>

          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {mostrarForm ? 'Cancelar' : '+ Criar Guilda'}
          </button>
        </div>

        {/* Formulário de criação */}
        <AnimatePresence>
          {mostrarForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-8 overflow-hidden"
            >
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
                Nova Guilda
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome da guilda..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                  minLength={3}
                />
                <button
                  type="submit"
                  disabled={mutCriar.isPending}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {mutCriar.isPending ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-pulse">
                <div className="h-5 bg-slate-800 rounded w-2/3 mb-4" />
                <div className="h-3 bg-slate-800 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : guildas.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-5xl mb-4 opacity-30">&#x1F3F0;</p>
            <p className="text-lg text-slate-500">Nenhuma guilda encontrada</p>
            <p className="text-sm text-slate-600 mt-1">Crie sua primeira guilda para organizar seus heróis</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {guildas.map((guilda, i) => (
                <motion.div
                  key={guilda.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors"
                >
                  <div className={`h-2 bg-gradient-to-r ${cores[i % cores.length]}`} />

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{guilda.nome}</h3>
                        <p className="text-xs text-slate-500">ID #{guilda.id}</p>
                      </div>
                      <span className="text-2xl font-extrabold text-slate-700">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-white">{guilda.total_herois}</p>
                        <p className="text-xs text-slate-500">Heróis</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-amber-400">{guilda.poder_total}</p>
                        <p className="text-xs text-slate-500">Poder Total</p>
                      </div>
                    </div>

                    <Link
                      to={`/guilda/${guilda.id}`}
                      className="block w-full py-2.5 bg-slate-800 hover:bg-cyan-600/20 text-slate-300 hover:text-cyan-400 text-sm text-center rounded-lg transition-colors font-medium"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}