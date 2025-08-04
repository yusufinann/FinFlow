import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("../../pages/personnel/HomePage/index"));
const NewCustomerPage = lazy(() => import("../../pages/personnel/NewCustomerRecord"));
const AccountingPage = lazy(() => import("../../pages/personnel/AccountingPage"));
const CustomerSearchPage = lazy(() => import("../../pages/personnel/CustomerSearchPage/index"));
const PersonnelTransactionPage = lazy(() => import("../../pages/personnel/PersonnelTransactionPage"));

const PersonnelRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customers/new" element={<NewCustomerPage />} />
      <Route path="/accounts" element={<AccountingPage />} />
      <Route path="/customers/search" element={<CustomerSearchPage />} />
      <Route path="/transactions" element={<PersonnelTransactionPage />} />
    </Routes>
  );
};

export default PersonnelRoutes;