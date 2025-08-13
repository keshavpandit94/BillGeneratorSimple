import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GenerateBill from './Pages/GenerateBill';
import CustomerDatabasePage from './Pages/CustomerDatabasePage';
import EditBill from './pages/EditBill';
import Preview from './components/Preview';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/generate" />} />
        <Route path="/generate" element={<GenerateBill />} />
        <Route path="/database" element={<CustomerDatabasePage />} />
        <Route path="/edit/:invoiceNumber" element={<EditBill />} />
        <Route path="/perview/:invoiceNumber" element={<Preview />} />
      </Routes>
    </Router>
  );
};

export default App;
