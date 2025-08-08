import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('../../pages/admin/HomePage'));
const NewPersonnelPage = lazy(() => import('../../pages/admin/NewPersonnelPage'));
const PersonnelLogs = lazy(() => import('../../pages/admin/PersonnelLogs'));
const PersonnelSearchPage = lazy(() => import('../../pages/admin/PersonnelSearchPage'));
const ChatPage = lazy(() => import("../../shared/ChatPage"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/personnel/new" element={<NewPersonnelPage />} />
      <Route path="/personnel-logs" element={<PersonnelLogs />} />
      <Route path="/personnels/search" element={<PersonnelSearchPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
};

export default AdminRoutes;