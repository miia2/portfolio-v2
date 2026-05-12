import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Store from './pages/Store';
import ProtectedRoute from './components/ProtectedRoute'; // O que você já tinha criado

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Painel do Dono da Loja */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Vitrine Pública (Ex: site.com/loja/loja-da-mia) */}
        <Route path="/loja/:slug" element={<Store />} />
      </Routes>
    </Router>
  );
}

export default App;