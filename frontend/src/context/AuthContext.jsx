import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.get('/auth/perfil')
        .then((res) => setUsuario(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setCarregando(false));
    } else {
      setCarregando(false);
    }
  }, [token]);

  async function login(email, senha) {
    const res = await api.post('/auth/login', { email, senha });
    const { token: novoToken, usuario: dados } = res.data;
    localStorage.setItem('token', novoToken);
    setToken(novoToken);
    setUsuario(dados);
    navigate('/dashboard');
  }

  async function cadastrar(nome, email, senha) {
    await api.post('/auth/cadastro', { nome, email, senha });
    navigate('/login');
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}