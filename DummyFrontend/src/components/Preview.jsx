import axios from 'axios';
import { Printer } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Preview() {
  const { invoiceNumber } = useParams();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/invoices/data-invoice/${invoiceNumber}`)
      .then((res) => {
        const data = res.data.data;

        // Convert comma-separated fields to array of item objects
        const products = data.product?.split(',') || [];
        const prices = data.price?.split(',') || [];
        const quantities = data.quantity?.split(',') || [];

        const combinedItems = products.map((product, index) => ({
          product: product.trim(),
          price: parseFloat(prices[index]?.trim() || 0),
          quantity: parseInt(quantities[index]?.trim() || 0),
        }));

        setCustomerData(data);
        setItems(combinedItems);
      })
      .catch((err) => {
        console.error('Error loading invoice', err);
        alert('Error loading invoice');
      });
  }, [invoiceNumber]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Bill</h2>
        <button
          onClick={() => window.print()}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Printer className="w-4 h-4 mr-1" />
          Print
        </button>
      </div>

      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-blue-600">Vision Care Optics</h3>
          <p className="text-sm text-gray-600">123 Optical Street, City Center, State 12345</p>
          <p className="text-sm text-gray-600">+1 (555) 123-4567 | info@visioncareoptics.com</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Bill To:</strong></p>
            <p>{customerData.name || 'Customer Name'}</p>
            <p className="text-sm text-gray-600">{customerData.address || 'Customer Address'}</p>
          </div>
          <div className="text-right">
            <p><strong>Invoice No:</strong> {customerData?.invoiceNumber || '--'}</p>
            <p><strong>Date:</strong> {customerData?.date || '--'}</p>
            <p><strong>Delivery Date:</strong> {customerData?.deliveryDate || '--'}</p>
            <p><strong>Mobile No:</strong> {customerData?.mobileNumber || '--'}</p>
          </div>
        </div>

        {/* Items Table */}
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
              {items.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm">{item.product}</td>
                  <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right">₹ {item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 text-right">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹ {customerData.grandPrice || total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <span>₹ {customerData.paidAmount || '0.00'}</span>
          </div>
          <div className="flex justify-between font-bold text-red-600">
            <span>Due:</span>
            <span>₹ {customerData.duesAmount || (total - customerData.paidAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mt-6 text-blue-600">
          <p>Thank you for choosing Vision Care Optics!</p>
        </div>
      </div>
    </div>
  );
}

export default Preview;
