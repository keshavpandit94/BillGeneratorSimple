import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';


const EditInvoice = () => {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    invoiceNumber: '',
    date: '',
    name: '',
    mobileNumber: '',
    items: [],
    paidAmount: 0,
    grandPrice: 0,
    duesAmount: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch invoice details
  useEffect(() => {
    axios
      .get(`/api/invoices/data-invoice/${invoiceNumber}`)
      .then((res) => {
        const data = res.data.data;

        // ✅ if backend sends comma-separated fields
        let items = [];
        if (data.product && data.offerPrice && data.quantity ) {
          const products = data.product.split(',');
          const offerPrices = data.offerPrice.split(',');
          const originalPrices = data.originalPrice.split(',');
          const quantities = data.quantity.split(',');

          items = products.map((p, i) => ({
            product: p.trim(),
            offerPrice: parseFloat(offerPrices[i]?.trim() || 0),
            originalPrice: parseFloat(originalPrices[i]?.trim() || 0),
            quantity: parseInt(quantities[i]?.trim() || 0),
          }));
        } else {
          items = Array.isArray(data.items) ? data.items : [];
        }

        setInvoice({
          invoiceNumber: data.invoiceNumber || '',
          date: data.date || '',
          name: data.name || '',
          mobileNumber: data.mobileNumber || '',
          items,
          paidAmount: data.paidAmount ?? 0,
          grandPrice: data.grandPrice ?? 0,
          duesAmount: data.duesAmount ?? 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading invoice', err);
        alert('Error loading invoice');
        setLoading(false);
      });
  }, [invoiceNumber]);

  // Auto-calc dues
  useEffect(() => {
    const grand = parseFloat(invoice.grandPrice) || 0;
    const paid = parseFloat(invoice.paidAmount) || 0;
    const dues = Math.max(grand - paid, 0);

    setInvoice((prev) => ({
      ...prev,
      duesAmount: dues,
    }));
  }, [invoice.paidAmount, invoice.grandPrice]);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/invoices/update/${invoiceNumber}`, invoice);
      alert('Invoice updated successfully');
      navigate('/database');
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update invoice');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading invoice data...</div>;
  }

  // totals
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded shadow max-w-3xl mx-auto"
    >
      <button
        type="button"
        onClick={() => navigate('/database')}
        className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-semibold">Edit Invoice - {invoice.invoiceNumber}</h2>

      {/* Basic info */}
      <label className="flex flex-col">
        Date
        <input
          type="date"
          name="date"
          value={invoice.date || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Customer Name
        <input
          type="text"
          name="name"
          value={invoice.name || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Mobile Number
        <input
          type="text"
          name="mobileNumber"
          value={invoice.mobileNumber || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </label>

      {/* Items Table (Preview-style, read only) */}
      <h3 className="font-medium text-lg mt-4">Purchased Items</h3>
      <div className="border border-gray-300 rounded-md overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Qty</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Price</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm">{item.product}</td>
                  <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right">₹ {item.originalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">₹ {item.offerPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    ₹ {(item.offerPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Section */}
      <h3 className="font-medium text-lg mt-4">Payment Details</h3>

      <label className="flex flex-col">
        Grand Price (with tax)
        <input
          type="number"
          name="grandPrice"
          value={invoice.grandPrice ?? 0}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Paid Amount
        <input
          type="number"
          name="paidAmount"
          value={invoice.paidAmount ?? 0}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="flex flex-col">
        Due Amount
        <input
          type="number"
          name="duesAmount"
          value={invoice.duesAmount ?? 0}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </label>

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
