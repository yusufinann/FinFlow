import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainAppLayout from "../../layouts/MainAppLayout";
import {
  PersonnelAuthProvider,
  usePersonnelAuth,
} from "../../shared/context/PersonnelAuthContext";
import { WebSocketProvider } from "../../shared/context/websocketContext";
const PersonnelLoginPage = lazy(() =>
  import("../../pages/personnel/LoginPage/index")
);
const HomePage = lazy(() => import("../../pages/personnel/HomePage/index"));
const NewCustomerPage = lazy(() =>
  import("../../pages/personnel/NewCustomerRecord")
);
const AccountingPage = lazy(() =>
  import("../../pages/personnel/AccountingPage")
);
const CustomerSearchPage = lazy(() =>
  import("../../pages/personnel/CustomerSearchPage/index")
);
const PersonnelTransactionPage = lazy(() =>
  import("../../pages/personnel/PersonnelTransactionPage")
);
const AppRoutes = () => {
  const { personnel, token,} = usePersonnelAuth();

  return (
    <WebSocketProvider auth={{ user: personnel, token: token }} userType='personnel'>
      <Routes>
        <Route path="/personnel-login" element={<PersonnelLoginPage />} />
        <Route element={<MainAppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/customers/new" element={<NewCustomerPage />} />
          <Route path="/accounts" element={<AccountingPage />} />
          <Route path="/customers/search" element={<CustomerSearchPage />} />
          <Route
            path="/personnel/transactions"
            element={<PersonnelTransactionPage />}
          />
        </Route>
      </Routes>
    </WebSocketProvider>
  );
};

const PersonnelRoutes = () => {
  return (
    <PersonnelAuthProvider>
      <AppRoutes />
    </PersonnelAuthProvider>
  );
};

export default PersonnelRoutes;
