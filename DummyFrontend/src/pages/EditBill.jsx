import React from 'react';
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import EditInvoice from '../components/EditInvoice';

const EditBill = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationTabs />
      <div className="p-6">
        <EditInvoice />
      </div>
    </div>
  );
};

export default EditBill;
