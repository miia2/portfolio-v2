import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';
import Store from './pages/Store';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* O Toaster fica aqui, vigiando o app de forma invisível até ser chamado */}
      <Toaster 
        position="top-right" // Define onde o alerta vai aparecer (ex: canto superior direito)
        richColors          // Ativa cores bonitas para sucesso (verde) e erro (vermelho)
        closeButton         // Adiciona um botão de "X" discreto para fechar
      />
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
  </>
  );
}

export default App;
     