import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const token = localStorage.getItem('token');

  // Si no hay token guardado ni estado de autenticación activo, redirigir
  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // De lo contrario, permitimos acceso, pero si luego el token es inválido,
  // la función checkAuth en App.tsx lo expulsará limpiando el token.
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
