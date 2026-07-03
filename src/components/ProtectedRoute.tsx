import { type ReactNode } from 'react'; 
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // CORRIGIDO: Agora puxa a mesma chave salva pelo Zustand e lida pelo Axios
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; 
};

export default ProtectedRoute;