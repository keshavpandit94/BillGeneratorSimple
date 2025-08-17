import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GenerateBill from './Pages/GenerateBill';
import EditBill from './pages/EditBill';
import PrintPreview from './components/PrintPreview';
import ProductsPage from './pages/ProductPage';
import CustomerDatabasePage from './pages/CustomerDatabasePage';
import EditProductPage from './pages/EditProductPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/generate" />} />
        <Route path="/generate" element={<GenerateBill />} />
        <Route path="/database" element={<CustomerDatabasePage />} />
        <Route path="/edit/:invoiceNumber" element={<EditBill />} />
        <Route path="/preview/:invoiceNumber" element={<PrintPreview />} />


        <Route path="/products" element={<ProductsPage />} />
        <Route path="/add-products" element={<EditProductPage />} />
        <Route path="/edit-products/:id" element={<EditProductPage />} />
      </Routes>
    </Router>
  );
};

export default App;
