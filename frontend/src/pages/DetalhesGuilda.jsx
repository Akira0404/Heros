import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import Navbar from '../components/Navbar';

const coresClasse = {
  Mago: 'text-violet-400',
  Guerreiro: 'text-red-400',
  Arqueiro: 'text-emerald-400',
  Ladinho: 'text-amber-400',
};

export default function DetalhesGuilda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: guilda, isLoading } = useQuery({
    queryKey: ['guilda', id],
    queryFn: async () => {
      const { data } = await api.get(`/guildas/${id}`);
      return data;
    },
  });

  const { data: todasGuildas = [] } = useQuery({
    queryKey: ['guildas'],
    queryFn: async () => {
      const { data } = await api.get('/guildas');
      return data;
    },
  });

  const { data: meusHerois = [] } = useQuery({
    queryKey: ['herois'],
    queryFn: async () => {
      const { data } = await api.get('/herois');
      return data;
    },
  });

  const mutMover = useMutation({
    mutationFn: ({ heroiId, guildaId }) =>
      api.put(`/guildas/mover/${heroiId}`, { guilda_id: guildaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guilda', id] });
      queryClient.invalidateQueries({ queryKey: ['herois'] });
      queryClient.invalidateQueries({ queryKey: ['guildas-usuario'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
      toast.success('Herói movido com sucesso!');
    },
    onError: (err) => toast.error(err.response?.data?.erro || 'Erro ao mover herói'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!guilda) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <p className="text-center text-slate-500 py-20">Guilda não encontrada.</p>
      </div>
    );
  }

  const heroisNaGuilda = guilda.herois || [];
  const heroisFora = meusHerois.filter((h) => h.guilda_id !== Number(id));

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/guildas')}
            className="text-sm text-slate-500 hover:text-white mb-6 transition-colors"
          >
            &larr; Voltar às Guildas
          </button>

          {/* Header da Guilda */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-2">{guilda.nome}</h1>
            <p className="text-sm text-slate-500">
              ID #{guilda.id} &middot; {heroisNaGuilda.length} herói(s) seus nesta guilda
            </p>
          </div>

          {/* Heróis nesta guilda */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4">
              Seus Heróis nesta Guilda
            </h2>

            {heroisNaGuilda.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-6">
                Você ainda não tem heróis nesta guilda.
              </p>
            ) : (
              <div className="space-y-2">
                {heroisNaGuilda.map((heroi, i) => (
                  <motion.div
                    key={heroi.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={heroi.avatar_url}
                        alt={heroi.nome}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/40x40/1e293b/94a3b8?text=H';
                        }}
                      />
                      <div>
                        <p className="text-sm text-white font-medium">{heroi.nome}</p>
                        <p className={`text-xs ${coresClasse[heroi.classe] || 'text-slate-400'}`}>
                          {heroi.classe} &middot; Poder {heroi.nivel_poder}
                        </p>
                      </div>
                    </div>

                    <select
                      value={id}
                      onChange={(e) => {
                        if (e.target.value !== id) {
                          mutMover.mutate({ heroiId: heroi.id, guildaId: Number(e.target.value) });
                        }
                      }}
                      disabled={mutMover.isPending}
                      className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      {todasGuildas.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id === Number(id) ? '📍 ' : ''}{g.nome}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Mover heróis de outras guildas para esta */}
          {heroisFora.length > 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-1">
                Mover Herói para Esta Guilda
              </h2>
              <p className="text-xs text-slate-600 mb-4">
                Selecione um herói de outra guilda para movê-lo para {guilda.nome}.
              </p>

              <div className="space-y-2">
                {heroisFora.map((heroi, i) => (
                  <motion.div
                    key={heroi.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={heroi.avatar_url}
                        alt={heroi.nome}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/40x40/1e293b/94a3b8?text=H';
                        }}
                      />
                      <div>
                        <p className="text-sm text-white font-medium">{heroi.nome}</p>
                        <p className="text-xs text-slate-500">
                          {heroi.classe} &middot; Guilda: {heroi.nome_guilda}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => mutMover.mutate({ heroiId: heroi.id, guildaId: Number(id) })}
                      disabled={mutMover.isPending}
                      className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      Trazer para cá
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}