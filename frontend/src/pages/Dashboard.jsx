import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import HeroCard from '../components/HeroCard';

export default function Dashboard() {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState('');

  const { data: herois = [], isLoading } = useQuery({
    queryKey: ['herois'],
    queryFn: async () => {
      const { data } = await api.get('/herois');
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['estatisticas'],
    queryFn: async () => {
      const { data } = await api.get('/herois/estatisticas');
      return data;
    },
  });

  const mutacaoDispensar = useMutation({
    mutationFn: (id) => api.delete(`/herois/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herois'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
      toast.success('Herói dispensado!');
    },
    onError: () => toast.error('Erro ao dispensar herói'),
  });

  const heroisFiltrados = useMemo(() => {
    if (!busca.trim()) return herois;
    const termo = busca.toLowerCase();
    return herois.filter((h) => h.nome.toLowerCase().includes(termo));
  }, [herois, busca]);

  const cards = [
    { label: 'Total de Heróis Recrutados', valor: stats?.totalHerois ?? '...' },
    { label: 'Média de Poder da Equipe', valor: stats?.mediaPoder ?? '...' },
    { label: 'Guilda Mais Forte', valor: stats?.guildaMaisForte ?? '...' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-extrabold text-white mb-8"
        >
          Bem-vindo, Recrutador{' '}
          <span className="text-cyan-400">{usuario?.nome}</span>
        </motion.h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 rounded-xl border border-slate-800 p-5"
            >
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.valor}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Recrutar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar herói por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <Link
            to="/recrutar"
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-sm text-center whitespace-nowrap"
          >
            + Recrutar Herói
          </Link>
        </div>

        {/* Grid de Heróis */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                  </div>
                </div>
                <div className="mt-4 h-1.5 bg-slate-800 rounded-full" />
              </div>
            ))}
          </div>
        ) : heroisFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4 opacity-30">&#x2694;</p>
            <p className="text-lg text-slate-500">
              {busca ? 'Nenhum herói encontrado' : 'Nenhum herói recrutado ainda'}
            </p>
            {!busca && (
              <Link to="/recrutar" className="inline-block mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                Recrute seu primeiro herói &rarr;
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {heroisFiltrados.map((heroi, i) => (
                <HeroCard
                  key={heroi.id}
                  heroi={heroi}
                  index={i}
                  onDispensar={(id) => {
                    if (confirm('Tem certeza que deseja dispensar este herói?')) {
                      mutacaoDispensar.mutate(id);
                    }
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}