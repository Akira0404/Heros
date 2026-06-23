import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import Navbar from '../components/Navbar';

const CLASSES = ['Mago', 'Guerreiro', 'Arqueiro', 'Ladinho'];

const STATUS_COR = {
  'Em andamento': 'text-amber-400 bg-amber-400/10',
  'Concluída': 'text-emerald-400 bg-emerald-400/10',
  'Falhou': 'text-red-400 bg-red-400/10',
};

const MISSOES_RANDOM = [
  'Limpar a caverna de Goblins',
  'Proteger a vila dos bandidos',
  'Escoltar caravana mercante',
  'Derrotar o dragão da montanha',
  'Investigar ruínas antigas',
  'Caçar a fera da floresta sombria',
  'Resgatar prisioneiros do forte inimigo',
  'Coletar ervas raras no pântano',
  'Patrulhar a fronteira do reino',
  'Explorar a masmorra esquecida',
];

export default function DetalhesHeroi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: '', classe: '', nivel_poder: 0 });

  const { data: heroi, isLoading } = useQuery({
    queryKey: ['heroi', id],
    queryFn: async () => {
      const { data } = await api.get(`/herois/${id}`);
      setForm({ nome: data.nome, classe: data.classe, nivel_poder: data.nivel_poder });
      return data;
    },
  });

  const { data: missoes = [] } = useQuery({
    queryKey: ['missoes', id],
    queryFn: async () => {
      const { data } = await api.get(`/missoes/heroi/${id}`);
      return data;
    },
  });

  const mutAtualizar = useMutation({
    mutationFn: (dados) => api.put(`/herois/${id}`, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroi', id] });
      queryClient.invalidateQueries({ queryKey: ['herois'] });
      toast.success('Herói atualizado!');
      setEditando(false);
    },
    onError: () => toast.error('Erro ao atualizar herói'),
  });

  const mutMissao = useMutation({
    mutationFn: () => {
      const descricao = MISSOES_RANDOM[Math.floor(Math.random() * MISSOES_RANDOM.length)];
      const recompensa_ouro = Math.floor(Math.random() * 450) + 50;
      return api.post(`/missoes/heroi/${id}`, { descricao, recompensa_ouro });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missoes', id] });
      toast.success('Herói enviado para missão!');
    },
    onError: () => toast.error('Erro ao enviar para missão'),
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

  if (!heroi) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <p className="text-center text-slate-500 py-20">Herói não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-slate-500 hover:text-white mb-6 transition-colors"
          >
            &larr; Voltar ao Dashboard
          </button>

          {/* Hero Info */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-5">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={heroi.avatar_url}
                alt={heroi.nome}
                className="w-28 h-28 rounded-2xl object-cover border border-slate-700"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/112x112/1e293b/94a3b8?text=H';
                }}
              />
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-white mb-2">{heroi.nome}</h1>
                <p className="text-sm text-slate-400">
                  Classe: <span className="text-cyan-400 font-medium">{heroi.classe}</span>
                </p>
                <p className="text-sm text-slate-400">
                  Poder: <span className="text-amber-400 font-medium">{heroi.nivel_poder}/100</span>
                </p>
                <p className="text-sm text-slate-400 mb-3">
                  Guilda: <span className="text-amber-400 font-medium">{heroi.nome_guilda}</span>
                </p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${heroi.nivel_poder}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Evolução do Herói</h2>
              <button
                onClick={() => setEditando(!editando)}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            </div>

            {editando && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutAtualizar.mutate({
                    nome: form.nome,
                    classe: form.classe,
                    nivel_poder: Number(form.nivel_poder),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                    required
                    minLength={3}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Classe</label>
                  <select
                    value={form.classe}
                    onChange={(e) => setForm({ ...form, classe: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    Nível de Poder: <span className="text-cyan-400 font-bold">{form.nivel_poder}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.nivel_poder}
                    onChange={(e) => setForm({ ...form, nivel_poder: e.target.value })}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mutAtualizar.isPending}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {mutAtualizar.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </form>
            )}
          </div>

          {/* Missions */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Histórico de Missões</h2>
              <button
                onClick={() => mutMissao.mutate()}
                disabled={mutMissao.isPending}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {mutMissao.isPending ? 'Enviando...' : 'Enviar para Missão'}
              </button>
            </div>

            {missoes.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-8">Nenhuma missão registrada.</p>
            ) : (
              <div className="space-y-2">
                {missoes.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">{m.descricao}</p>
                      <p className="text-xs text-slate-500">Recompensa: {m.recompensa_ouro} ouro</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        STATUS_COR[m.status] || 'text-slate-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}