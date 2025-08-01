import React, {Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PersonnelRoutes from './components/PersonnelRoutes';
import LoadingFallback from './components/LoadingFallback';
import CustomerRoutes from './components/CustomerRoutes';

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          
          <Route path="/*" element={<PersonnelRoutes />} />
          <Route path="/customer/*" element={<CustomerRoutes />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;