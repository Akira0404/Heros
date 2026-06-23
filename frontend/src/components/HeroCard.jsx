import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const coresClasse = {
  Mago: 'from-violet-500 to-indigo-600',
  Guerreiro: 'from-red-500 to-orange-600',
  Arqueiro: 'from-emerald-500 to-green-600',
  Ladinho: 'from-amber-400 to-yellow-600',
};

export default function HeroCard({ heroi, index, onDispensar }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
      className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors group"
    >
      <div className={`h-1.5 bg-gradient-to-r ${coresClasse[heroi.classe] || 'from-slate-600 to-slate-500'}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <img
            src={heroi.avatar_url}
            alt={heroi.nome}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
            onError={(e) => {
              e.target.src = 'https://placehold.co/56x56/1e293b/94a3b8?text=H';
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">{heroi.nome}</h3>
            <p className="text-sm text-slate-400">{heroi.classe}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Nível de Poder</span>
              <span className="text-cyan-400 font-semibold">{heroi.nivel_poder}/100</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${heroi.nivel_poder}%` }}
                transition={{ delay: index * 0.08 + 0.4, duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Guilda: <span className="text-amber-400 font-medium">{heroi.nome_guilda}</span>
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/heroi/${heroi.id}`}
            className="flex-1 py-2 bg-slate-800 hover:bg-cyan-600/20 text-slate-300 hover:text-cyan-400 text-sm text-center rounded-lg transition-colors font-medium"
          >
            Detalhes
          </Link>
          <button
            onClick={() => onDispensar(heroi.id)}
            className="px-4 py-2 bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 text-sm rounded-lg transition-colors font-medium"
          >
            Dispensar
          </button>
        </div>
      </div>
    </motion.div>
  );
}