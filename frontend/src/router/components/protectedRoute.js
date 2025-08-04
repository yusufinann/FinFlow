import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import LoadingFallback from './LoadingFallback';

const ProtectedRoute = ({ allowedRoles, useAuthHook, loginPath }) => {
  const navigate = useNavigate();
  // Değişiklik burada: `user` yerine `personnel` olarak isimlendiriyoruz
  const { isAuthenticated, personnel, isLoading } = useAuthHook();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !personnel) {
      navigate(loginPath, { replace: true });
      return;
    }

    if (!allowedRoles || !allowedRoles.includes(personnel.role)) {
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, personnel, allowedRoles, navigate, loginPath]);


  if (isLoading) {
    return <LoadingFallback />;
  }
  
  const isAuthorized = isAuthenticated && personnel && allowedRoles.includes(personnel.role);

  return isAuthorized ? <Outlet /> : <LoadingFallback />;
};

export default ProtectedRoute;