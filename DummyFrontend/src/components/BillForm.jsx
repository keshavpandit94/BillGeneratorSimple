import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { productList } from '../Data/product';
import BillPreview from './BillPreview';

const BillForm = ({ invoice, setInvoice }) => {

  // Fetch new invoice number on load
  useEffect(() => {
    axios.get('/api/invoices/generate-invoice-number')
      .then(res => {
        setInvoice(prev => ({
          ...prev,
          invoiceNumber: res.data.data.invoiceNumber
        }));
      })
      .catch(err => {
        console.error('Failed to generate invoice number:', err.message);
      });
  }, []);

  // Set current date on load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setInvoice(prev => ({
      ...prev,
      date: today,
      bookingDate: today,
    }));
  }, []);

  // Auto calculate grandPrice (with 10% tax) and duesAmount
  useEffect(() => {
    const subTotal = invoice.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return total + quantity * price;
    }, 0);

    const taxAmount = subTotal * 0.10;
    const grandPrice = subTotal + taxAmount;
    const duesAmount = grandPrice - parseFloat(invoice.paidAmount || 0);

    setInvoice(prev => ({
      ...prev,
      grandPrice,
      duesAmount,
    }));
  }, [invoice.items, invoice.paidAmount]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  // Product/item update
  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;

    if (field === 'product') {
      const found = productList.find(p => p.name === value);
      newItems[index].price = found?.rate || 0;
    }

    setInvoice(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0 }]
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
        const newInvoiceNumber = res.data.data.invoiceNumber;
        setInvoice({
          invoiceNumber: newInvoiceNumber,
          date: today,
          name: '',
          address: '',
          mobileNumber: '',
          bookingDate: today,
          deliveryDate: '',
          items: [{ product: '', quantity: 1, price: 0 }],
          grandPrice: 0,
          paidAmount: 0,
          duesAmount: 0,
        });
      });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(invoice)

    const countRes = await axios.get('/api/invoices/get-dataCount');
    console.log("Count:", countRes.data.data)
    const count = countRes.data.data;

    if (count >= 100) {
      alert('Invoice limit reached (100 invoices). Please purchase a license to continue.');
      return;
    }

    await axios.post('/api/invoices/add-invoice', invoice)
      .then((response) => {
        alert('Bill submitted successfully!');
        clearForm();
      })
      .catch((error) => {
        console.error('Error saving invoice:', error);
        alert('Failed to submit bill');
      });
  };

  return (
    <div className=''>
      <div>
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded shadow-md ">
          <h2 className="text-xl font-bold">Bill Form</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              readOnly
              placeholder="Invoice No."
              className="border p-2 rounded"
            />

            <input
              name="date"
              value={invoice.date}
              onChange={handleInputChange}
              placeholder="Date"
              type="date"
              readOnly
              className="border p-2 rounded"
              required
            />

            <input
              name="name"
              value={invoice.name}
              onChange={handleInputChange}
              placeholder="Customer Name"
              className="border p-2 rounded"
              required
            />

            <input
              name="mobileNumber"
              value={invoice.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              pattern="\d{10}"
              title="Mobile number must be exactly 10 digits"
              maxLength={10}
              className="border p-2 rounded"
              required
            />

            <input
              name="address"
              value={invoice.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="border p-2 rounded"
            />

            <input
              name="bookingDate"
              value={invoice.bookingDate}
              onChange={handleInputChange}
              placeholder="Booking Date"
              type="date"
              className="border p-2 rounded"
            />

            <input
              name="deliveryDate"
              value={invoice.deliveryDate}
              onChange={handleInputChange}
              placeholder="Delivery Date"
              type="date"
              className="border p-2 rounded"
            />

          </div>

          <h3 className="text-lg font-semibold mt-4">Items</h3>
          {invoice.items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <select
                value={item.product}
                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                className="border p-2 rounded w-1/2"
                required
              >
                <option value="">-- Select Product --</option>
                {productList.map((p, i) => (
                  <option key={i} value={p.name}>{p.name}</option>
                ))}
              </select>

              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                placeholder="Qty"
                className="border p-2 rounded w-1/6"
                required
              />

              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                placeholder="Price"
                className="border p-2 rounded w-1/6"
                required
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          <button type="button" onClick={addItem} className="flex items-center gap-1 text-green-600">
            <Plus size={18} /> Add Item
          </button>

          <div>
            <input
              name="paidAmount"
              type="number"
              value={invoice.paidAmount}
              onChange={handleInputChange}
              placeholder="Paid Amount"
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <input
              name="grandPrice"
              type="number"
              value={invoice.grandPrice}
              onChange={handleInputChange}
              placeholder="Total Price"
              readOnly
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <input
              name="duesAmount"
              type="number"
              value={invoice.duesAmount}
              onChange={handleInputChange}
              placeholder="Dues Amount"
              readOnly
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 mr-4 rounded">
              Submit Bill
            </button>

            <button type="button" onClick={clearForm} className="bg-blue-600 text-white py-2 px-4 rounded">
              Remove Item
            </button>
          </div>
        </form>
      </div>
      <div className='pt-10'>
        {/* <BillPreview /> */}
      </div>
    </div>
  );
};

export default BillForm;
