import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/admin/HomePage';
import NewPersonnelPage from '../../pages/admin/NewPersonnelPage';
import PersonnelLogs from '../../pages/admin/PersonnelLogs';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/personnel/new" element={<NewPersonnelPage />} />
      <Route path="/personnel-logs" element={<PersonnelLogs />} />
    </Routes>
  );
};

export default AdminRoutes;