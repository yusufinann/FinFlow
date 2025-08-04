import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedCustomerRoute from "./ProtectedCustomerRoute";

const CustomerDashboardPage = lazy(() => import("../../pages/customer/CustomerDashboardPage"));
const ExchangeRates = lazy(() => import("../../pages/customer/ExchangeRates"));
const MyAccounts = lazy(() => import("../../pages/customer/CustomerDashboardPage/DashboardLeftArea/MyAccounts"));
const NotificationsPage = lazy(() => import("../../pages/customer/NotificationsPage"));
const TransactionPage = lazy(() => import("../../pages/customer/TransactionPage"));

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedCustomerRoute />}>
        <Route path="/dashboard" element={<CustomerDashboardPage />} />
        <Route path="/my-accounts" element={<MyAccounts />} />
        <Route path="/exchange" element={<ExchangeRates />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/transfer" element={<TransactionPage />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;