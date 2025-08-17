import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

const BillForm = ({ invoice, setInvoice }) => {
  const [productList, setProductList] = useState([]);

  // Fetch products
  useEffect(() => {
    axios.get('/api/products/allproducts')
      .then(res =>{ console.log(res.data.data || []); setProductList(res.data.data || [])})
      .catch(err => console.error('Failed to fetch products:', err.message));
  }, []);

  // Generate invoice number
  useEffect(() => {
    axios.get('/api/invoices/generate-invoice-number')
      .then(res => setInvoice(prev => ({ ...prev, invoiceNumber: res.data.data.invoiceNumber })))
      .catch(err => console.error('Failed to generate invoice number:', err.message));
  }, []);

  // Set current date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setInvoice(prev => ({ ...prev, date: today, bookingDate: today }));
  }, []);

  // Auto calculate totals
  useEffect(() => {
    const subTotal = invoice.items.reduce((total, item) => {
      const q = parseFloat(item.quantity) || 0;
      const p = parseFloat(item.offerPrice) || 0;
      return total + q * p;
    }, 0);
    const taxAmount = subTotal * 0.1;
    const grandPrice = subTotal + taxAmount;
    const duesAmount = grandPrice - parseFloat(invoice.paidAmount || 0);
    setInvoice(prev => ({ ...prev, grandPrice, duesAmount }));
  }, [invoice.items, invoice.paidAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];

    if (field === 'product') {
      const found = productList.find(p => p.name === value);
      newItems[index] = {
        product: value,
        quantity: 1,
        originalPrice: found?.originalPrice || 0,          // Original price
        offerPrice: found?.offerPrice || found?.price || 0, // Editable offer price
      };
    } else {
      newItems[index][field] = value;
    }

    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, originalPrice: 0, offerPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const clearForm = () => {
    const today = new Date().toISOString().split('T')[0];
    axios.get('/api/invoices/generate-invoice-number')
      .then(res => {
        setInvoice({
          invoiceNumber: res.data.data.invoiceNumber,
          date: today,
          name: '',
          address: '',
          mobileNumber: '',
          bookingDate: today,
          deliveryDate: '',
          items: [{ product: '', quantity: 1, originalPrice: 0, offerPrice: 0 }],
          grandPrice: 0,
          paidAmount: 0,
          duesAmount: 0,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const countRes = await axios.get('/api/invoices/get-dataCount');
    if (countRes.data.data >= 100) {
      alert('Invoice limit reached (100 invoices). Please purchase a license to continue.');
      return;
    }
    await axios.post('/api/invoices/add-invoice', invoice)
      .then(() => {
        alert('Bill submitted successfully!');
        clearForm();
      })
      .catch(err => {
        console.error('Error saving invoice:', err);
        alert('Failed to submit bill');
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-700">
          <FileText size={24} /> Bill Form
        </h2>

        {/* Top fields */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            Invoice Number
            <input
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              readOnly
              className="border-b border-gray-400 p-1 bg-transparent focus:outline-none"
            />
          </label>

          <label className="flex flex-col">
            Date
            <input
              name="date"
              type="date"
              value={invoice.date}
              readOnly
              className="border-b border-gray-400 p-1 bg-transparent focus:outline-none"
              required
            />
          </label>

          <label className="flex flex-col">
            Customer Name
            <input
              name="name"
              value={invoice.name}
              onChange={handleInputChange}
              placeholder="Customer Name"
              className="border p-2 rounded"
              required
            />
          </label>

          <label className="flex flex-col">
            Mobile Number
            <input
              name="mobileNumber"
              value={invoice.mobileNumber}
              onChange={handleInputChange}
              placeholder="10-digit number"
              pattern="\d{10}"
              maxLength={10}
              className="border p-2 rounded"
              required
            />
          </label>

          <label className="flex flex-col col-span-2">
            Address
            <input
              name="address"
              value={invoice.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            Booking Date
            <input
              name="bookingDate"
              type="date"
              value={invoice.bookingDate}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          </label>

          <label className="flex flex-col">
            Delivery Date
            <input
              name="deliveryDate"
              type="date"
              value={invoice.deliveryDate}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          </label>
        </div>

        {/* Items */}
        <h3 className="text-lg font-semibold mt-4">Items</h3>
        {invoice.items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2 items-end">
            <label className="w-1/3">
              Product
              <select
                value={item.product}
                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">-- Select Product --</option>
                {productList.map((p, i) => (
                  <option key={i} value={p.name}>{p.name}</option>
                ))}
              </select>
            </label>

            <label className="w-1/6">
              Original Price
              <input
                type="number"
                value={item.originalPrice}
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
              />
            </label>

            <label className="w-1/6">
              Offer Price
              <input
                type="number"
                value={item.offerPrice}
                onChange={(e) => handleItemChange(index, 'offerPrice', parseFloat(e.target.value))}
                className="border p-2 rounded w-full"
                required
              />
            </label>

            <label className="w-1/6">
              Qty
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                className="border p-2 rounded w-full"
                required
              />
            </label>
      
            <button type="button" onClick={() => removeItem(index)} className="text-red-500 mb-2">
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-gray-700 font-medium"
        >
          <Plus size={18} /> Add Item
        </button>

        {/* Payment / Totals */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <label className="flex flex-col">
            Paid Amount
            <input
              name="paidAmount"
              type="number"
              value={invoice.paidAmount}
              onChange={handleInputChange}
              className="border-b border-gray-400 p-1 focus:outline-none"
            />
          </label>

          <label className="flex flex-col">
            Total Price
            <input
              name="grandPrice"
              type="number"
              value={invoice.grandPrice}
              readOnly
              className="border-b border-gray-400 p-1 bg-transparent focus:outline-none"
            />
          </label>

          <label className="flex flex-col">
            Dues Amount
            <input
              name="duesAmount"
              type="number"
              value={invoice.duesAmount}
              readOnly
              className="border-b border-gray-400 p-1 bg-transparent text-red-600 font-semibold focus:outline-none"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
          >
            <CheckCircle2 size={18} /> Submit Bill
          </button>

          <button
            type="button"
            onClick={clearForm}
            className="flex items-center gap-2 bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600"
          >
            <RefreshCw size={18} /> Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;
