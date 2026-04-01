import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = pb.authStore.isValid;
  const user = pb.authStore.model;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user?.role || user?.rol; // Handle both field names just in case
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Acceso Restringido</h2>
          <p className="text-slate-500 max-w-md">
            No tienes los permisos necesarios para acceder a esta sección. 
            Se requiere el rol: <span className="font-semibold text-slate-700">{allowedRoles.join(' o ')}</span>.
          </p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;