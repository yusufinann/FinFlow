import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/admin/HomePage';
import NewPersonnelPage from '../../pages/admin/NewPersonnelPage';
import PersonnelLogs from '../../pages/admin/PersonnelLogs';
import PersonnelSearchPage from '../../pages/admin/PersonnelSearchPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/personnel/new" element={<NewPersonnelPage />} />
      <Route path="/personnel-logs" element={<PersonnelLogs />} />
       <Route path="/personnels/search" element={<PersonnelSearchPage />} />
    </Routes>
  );
};

export default AdminRoutes;