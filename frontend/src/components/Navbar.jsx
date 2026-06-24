import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/recrutar', label: 'Recrutar' },
  { to: '/guildas', label: 'Guildas' },
  { to: '/perfil', label: 'Perfil' },
];

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold text-cyan-400 tracking-tight">
            Portal de Heróis
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={logout}
              className="ml-3 px-4 py-2 bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 text-sm rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}