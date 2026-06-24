import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import Navbar from '../components/Navbar';

const FILTROS = ['Todos', 'Mago', 'Guerreiro', 'Arqueiro', 'Ladinho'];

const coresClasse = {
  Mago: 'from-violet-500 to-indigo-600',
  Guerreiro: 'from-red-500 to-orange-600',
  Arqueiro: 'from-emerald-500 to-green-600',
  Ladinho: 'from-amber-400 to-yellow-600',
};

const badgeClasse = {
  Mago: 'bg-violet-500/20 text-violet-400',
  Guerreiro: 'bg-red-500/20 text-red-400',
  Arqueiro: 'bg-emerald-500/20 text-emerald-400',
  Ladinho: 'bg-amber-400/20 text-amber-400',
};

export default function Catalogo() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [classeFiltro, setClasseFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [guildaSelecionada, setGuildaSelecionada] = useState('');

  const params = {};
  if (classeFiltro !== 'Todos') params.classe = classeFiltro;
  if (busca.trim()) params.busca = busca;

  const { data: catalogo = [], isLoading } = useQuery({
    queryKey: ['catalogo', classeFiltro, busca],
    queryFn: async () => {
      const { data } = await api.get('/catalogo', { params });
      return data;
    },
  });

  const { data: guildas = [] } = useQuery({
    queryKey: ['guildas'],
    queryFn: async () => {
      const { data } = await api.get('/guildas');
      return data;
    },
  });

  const mutRecrutar = useMutation({
    mutationFn: ({ index, guilda_id }) =>
      api.post('/catalogo/recrutar', { index, guilda_id }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['herois'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
      toast.success(res.data.mensagem);
      setSelecionado(null);
      setGuildaSelecionada('');
    },
    onError: (err) => toast.error(err.response?.data?.erro || 'Erro ao recrutar'),
  });

  function handleRecrutar() {
    if (!guildaSelecionada) {
      toast.error('Selecione uma guilda primeiro');
      return;
    }
    mutRecrutar.mutate({
      index: selecionado,
      guilda_id: Number(guildaSelecionada),
    });
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-extrabold text-white mb-2"
          >
            Catálogo de Heróis
          </motion.h1>
          <p className="text-slate-500 text-sm">
            Explore heróis lendários disponíveis para recrutamento
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Buscar herói..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <div className="flex gap-1.5 flex-wrap">
            {FILTROS.map((f) => (
              <button
                key={f}
                onClick={() => setClasseFiltro(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  classeFiltro === f
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-800 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : catalogo.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-5xl mb-4 opacity-30">&#x2694;</p>
            <p className="text-lg text-slate-500">Nenhum herói encontrado</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {catalogo.map((heroi, i) => (
                <motion.div
                  key={heroi.nome}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors cursor-pointer group"
                  onClick={() => setSelecionado(i)}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${coresClasse[heroi.classe] || 'from-slate-600 to-slate-500'}`} />

                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <img
                        src={heroi.avatar_url}
                        alt={heroi.nome}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-700 group-hover:border-cyan-500/50 transition-colors"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                          {heroi.nome}
                        </h3>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasse[heroi.classe] || 'bg-slate-800 text-slate-400'}`}>
                          {heroi.classe}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {heroi.descricao}
                    </p>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Nível de Poder</span>
                        <span className="text-cyan-400 font-semibold">{heroi.nivel_poder}/100</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${heroi.nivel_poder}%` }}
                          transition={{ delay: i * 0.06 + 0.4, duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal de Recrutamento */}
        <AnimatePresence>
          {selecionado !== null && catalogo[selecionado] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelecionado(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full"
              >
                <div className="flex items-start gap-4 mb-5">
                  <img
                    src={catalogo[selecionado].avatar_url}
                    alt={catalogo[selecionado].nome}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h2 className="text-xl font-extrabold text-white">
                      {catalogo[selecionado].nome}
                    </h2>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasse[catalogo[selecionado].classe]}`}>
                      {catalogo[selecionado].classe}
                    </span>
                    <p className="text-sm text-amber-400 font-semibold mt-1">
                      Poder: {catalogo[selecionado].nivel_poder}/100
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-5">
                  {catalogo[selecionado].descricao}
                </p>

                <div className="mb-5">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Escolha uma Guilda para o herói
                  </label>
                  <select
                    value={guildaSelecionada}
                    onChange={(e) => setGuildaSelecionada(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="">Selecione uma guilda...</option>
                    {guildas.map((g) => (
                      <option key={g.id} value={g.id}>{g.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRecrutar}
                    disabled={mutRecrutar.isPending}
                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    {mutRecrutar.isPending ? 'Recrutando...' : 'Recrutar Herói'}
                  </button>
                  <button
                    onClick={() => setSelecionado(null)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}