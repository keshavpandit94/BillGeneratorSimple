import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditInvoice = () => {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    date: '',
    name: '',
    mobileNumber: '',
    items: [],
    paidAmount: '',
    grandPrice: '',
    duesAmount: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/invoices/data-invoice/${invoiceNumber}`)
      .then((res) => {
        const data = res.data.data;
        setInvoice({
          invoiceNumber: data.invoiceNumber || '',
          date: data.date || '',
          name: data.name || '',
          mobileNumber: data.mobileNumber || '',
          items: Array.isArray(data.items) ? data.items : [],
          paidAmount: data.paidAmount || '',
          grandPrice: data.grandPrice || '',
          duesAmount: data.duesAmount || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading invoice', err);
        alert('Error loading invoice');
        setLoading(false);
      });
  }, [invoiceNumber]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    setInvoice((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/invoices/update/${invoiceNumber}`, invoice);
      alert('Invoice updated successfully');
      navigate('/');
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update invoice');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading invoice data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Edit Invoice - {invoice.invoiceNumber}</h2>

      <input
        type="date"
        name="date"
        value={invoice.date || ''}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        type="text"
        name="name"
        placeholder="Customer Name"
        value={invoice.name || ''}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        type="text"
        name="mobileNumber"
        placeholder="Mobile Number"
        value={invoice.mobileNumber || ''}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <h3 className="font-medium text-lg mt-4">Items</h3>
      {invoice.items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={item.name || ''}
            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
            placeholder="Item"
            className="flex-1 border p-2"
          />
          <input
            type="number"
            value={item.quantity || ''}
            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
            placeholder="Qty"
            className="w-20 border p-2"
          />
          <input
            type="number"
            value={item.price || ''}
            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            placeholder="Price"
            className="w-24 border p-2"
          />
        </div>
      ))}

      <h3 className="font-medium text-lg mt-4">Payment Details</h3>

      <input
        type="number"
        name="grandPrice"
        placeholder="Grand Price (with tax)"
        value={invoice.grandPrice || ''}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        type="number"
        name="paidAmount"
        placeholder="Paid Amount"
        value={invoice.paidAmount || ''}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        type="number"
        name="duesAmount"
        placeholder="Due Amount"
        value={invoice.duesAmount || ''}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Update Invoice
      </button>
    </form>
  );
};

export default EditInvoice;
