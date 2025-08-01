import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import {
  CustomerAuthProvider,
  useCustomerAuth,
} from "../../shared/context/CustomerAuthContext";
import { WebSocketProvider } from "../../shared/context/websocketContext";
import NotificationsPage from "../../pages/customer/NotificationsPage";
import TransactionPage from "../../pages/customer/TransactionPage";

const CustomerLoginPage = lazy(() =>
  import("../../pages/customer/CustomerLoginPage/index")
);
const InitialPasswordPage = lazy(() =>
  import("../../pages/customer/CustomerLoginPage/InitalPasswordPage")
);
const CustomerDashboardPage = lazy(() =>
  import("../../pages/customer/CustomerDashboardPage")
);
const ExchangeRates = lazy(() => import("../../pages/customer/ExchangeRates"));
const MyAccounts = lazy(() =>
  import(
    "../../pages/customer/CustomerDashboardPage/DashboardLeftArea/MyAccounts"
  )
);

const AppRoutes = () => {
  const { customer, token } = useCustomerAuth();

  return (
    <WebSocketProvider auth={{ user: customer, token: token }}userType="customer">
      <Routes>
        <Route path="/customer-login" element={<CustomerLoginPage />} />
        <Route path="/initial-password" element={<InitialPasswordPage />} />
        <Route element={<CustomerLayout />}>
          <Route path="/dashboard" element={<CustomerDashboardPage />} />
          <Route path="/my-accounts" element={<MyAccounts />} />
          <Route path="/exchange" element={<ExchangeRates />} />
           <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/transfer" element={<TransactionPage />} />
        </Route>
      </Routes>
    </WebSocketProvider>
  );
};

const CustomerRoutes = () => {
  return (
    <CustomerAuthProvider>
      <AppRoutes />
    </CustomerAuthProvider>
  );
};

export default CustomerRoutes;
