import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/client';
import Navbar from '../components/Navbar';

const CLASSES = ['Mago', 'Guerreiro', 'Arqueiro', 'Ladinho'];

export default function RecrutarHeroi() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    nome: '',
    classe: '',
    nivel_poder: 50,
    avatar_url: '',
    guilda_id: '',
  });
  const [erros, setErros] = useState([]);

  const { data: guildas = [] } = useQuery({
    queryKey: ['guildas'],
    queryFn: async () => {
      const { data } = await api.get('/guildas');
      return data;
    },
  });

  const mutacao = useMutation({
    mutationFn: (dados) => api.post('/herois', dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herois'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas'] });
      toast.success('Herói recrutado com sucesso!');
      navigate('/dashboard');
    },
    onError: (err) => {
      const errs = err.response?.data?.erros;
      if (errs) setErros(errs.map((e) => e.message));
      else toast.error(err.response?.data?.erro || 'Erro ao recrutar');
    },
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErros([]);
    mutacao.mutate({
      ...form,
      nivel_poder: Number(form.nivel_poder),
      guilda_id: Number(form.guilda_id),
    });
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-extrabold text-white mb-8">Recrutar Novo Herói</h1>

          <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
            {erros.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-lg text-sm space-y-1">
                {erros.map((e, i) => <p key={i}>{e}</p>)}
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Nome do Herói</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Classe</label>
              <select
                value={form.classe}
                onChange={(e) => handleChange('classe', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
              >
                <option value="">Selecione...</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
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
                onChange={(e) => handleChange('nivel_poder', e.target.value)}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">URL do Avatar</label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Guilda</label>
              <select
                value={form.guilda_id}
                onChange={(e) => handleChange('guilda_id', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                required
              >
                <option value="">Selecione...</option>
                {guildas.map((g) => (
                  <option key={g.id} value={g.id}>{g.nome}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={mutacao.isPending}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {mutacao.isPending ? 'Recrutando...' : 'Recrutar Herói'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}