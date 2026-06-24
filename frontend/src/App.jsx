import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import RecrutarHeroi from './pages/RecrutarHeroi';
import DetalhesHeroi from './pages/DetalhesHeroi';
import Guildas from './pages/Guildas';
import DetalhesGuilda from './pages/DetalhesGuilda';
import Catalogo from './pages/Catalogo';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/catalogo" element={<ProtectedRoute><Catalogo /></ProtectedRoute>} />
      <Route path="/recrutar" element={<ProtectedRoute><RecrutarHeroi /></ProtectedRoute>} />
      <Route path="/guildas" element={<ProtectedRoute><Guildas /></ProtectedRoute>} />
      <Route path="/guilda/:id" element={<ProtectedRoute><DetalhesGuilda /></ProtectedRoute>} />
      <Route path="/heroi/:id" element={<ProtectedRoute><DetalhesHeroi /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}