import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingFallback from '../components/LoadingFallback'; 
import { usePersonnelAuth } from '../../shared/context/PersonnelAuthContext';

  const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading,personnelToken ,logout} = usePersonnelAuth();

  const decodedToken=personnelToken?parseJwt(personnelToken):null;
  const isTokenExpired = !decodedToken || decodedToken.exp * 1000 < Date.now();
  
  useEffect(() => {
    if (personnelToken && isTokenExpired) {
      logout();
    }
  }, [personnelToken, isTokenExpired, logout]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/personnel-login" replace />;
};

export default ProtectedRoute;