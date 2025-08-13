import React, { useState } from 'react';
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import BillForm from '../components/BillForm';
import BillPreview from '../components/BillPreview';

const GenerateBill = () => {

    const [invoice, setInvoice] = useState({
      invoiceNumber: '',
      date: '',
      name: '',
      address: '',
      mobileNumber: '',
      bookingDate: '',
      deliveryDate: '',
      items: [{ product: '', quantity: 1, price: 0 }],
      grandPrice: 0,
      paidAmount: 0,
      duesAmount: 0,
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationTabs />
      <div className="p-6 grid lg:grid-cols-2 gap-8">
        <BillForm invoice={invoice} setInvoice={setInvoice} />
        <BillPreview invoiceData={invoice}  />
      </div>
    </div>
  );
};

export default GenerateBill;
