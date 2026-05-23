import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Importe o novo componente aqui
import Dashboard from './pages/Dashboard';
import Store from './pages/Store';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- Adicione a rota aqui */}
        
        {/* Painel do Dono da Loja */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Vitrine Pública */}
        <Route path="/loja/:slug" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App;
     