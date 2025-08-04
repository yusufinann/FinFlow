import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import LoadingFallback from './components/LoadingFallback';
import LandingPage from '../components/LandingPage ';
import ProtectedRoute from './components/protectedRoute';

import { CustomerAuthProvider, useCustomerAuth } from '../shared/context/CustomerAuthContext';
import { PersonnelAuthProvider, usePersonnelAuth } from '../shared/context/PersonnelAuthContext';
import { WebSocketProvider } from '../shared/context/websocketContext';

import AdminRoutes from './components/AdminRoutes';
import PersonnelRoutes from './components/PersonnelRoutes';
import CustomerRoutes from './components/CustomerRoutes';

import AdminLayout from '../layouts/AdminLayout';
import MainAppLayout from '../layouts/MainAppLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import PersonnelInitialPasswordPage from '../pages/personnel/LoginPage/LoginPageRightArea/PersonnelInitialPasswordPage';

const CustomerLoginPage = React.lazy(() => import('../pages/customer/CustomerLoginPage/index'));
const InitialPasswordPage = React.lazy(() => import('../pages/customer/CustomerLoginPage/InitalPasswordPage'));
const PersonnelLoginPage = React.lazy(() => import('../pages/personnel/LoginPage'));

const PersonnelSystemLayout = () => {
  const { personnel, token } = usePersonnelAuth();
  return (
    <WebSocketProvider auth={{ user: personnel, token }} userType="personnel">
      <Outlet />
    </WebSocketProvider>
  );
};

const CustomerSystemLayout = () => {
  const { customer, token } = useCustomerAuth();
  return (
    <WebSocketProvider auth={{ user: customer, token }} userType="customer">
      <Outlet />
    </WebSocketProvider>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/initial-password" element={<InitialPasswordPage />} />
          <Route path="/personnel/initial-password" element={<PersonnelInitialPasswordPage />} />

          <Route element={<PersonnelAuthProvider><Outlet /></PersonnelAuthProvider>}>
            <Route path="/personnel-login" element={<PersonnelLoginPage />} />
            <Route element={<PersonnelSystemLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} useAuthHook={usePersonnelAuth} loginPath="/personnel-login"/>}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/*" element={<AdminRoutes />} />
                </Route>
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['PERSONNEL']} useAuthHook={usePersonnelAuth} loginPath="/personnel-login" />}>
                <Route element={<MainAppLayout />}>
                  <Route path="/personnel/*" element={<PersonnelRoutes />} />
                </Route>
              </Route>
            </Route>
          </Route>

          <Route element={<CustomerAuthProvider><Outlet /></CustomerAuthProvider>}>
            <Route path="/customer-login" element={<CustomerLoginPage />} />
            <Route element={<CustomerSystemLayout />}>
              <Route element={<CustomerLayout />}>
                 <Route path="/customer/*" element={<CustomerRoutes />} />
              </Route>
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;