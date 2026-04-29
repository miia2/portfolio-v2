import { type ReactNode } from 'react'; // Importação nova
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode; // Trocamos JSX.Element por ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('@Ludus:token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // No TypeScript moderno, precisamos garantir que o retorno seja um JSX
  return <>{children}</>; 
};

export default ProtectedRoute;