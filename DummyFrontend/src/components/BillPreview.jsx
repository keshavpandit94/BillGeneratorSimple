import { Printer } from 'lucide-react';
import React from 'react';

const BillPreview = ({ invoiceData }) => {

  const calculateSubtotal = () => {
    return invoiceData?.items?.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const offerPrice = parseFloat(item.offerPrice) || 0;
      return sum + quantity * offerPrice;
    }, 0) || 0;
  };

  const calculateTax = () => calculateSubtotal() * 0.10; // 10% tax

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const calculateDue = () => {
    const paid = parseFloat(invoiceData?.paidAmount) || 0;
    return Math.max(0, calculateTotal() - paid);
  };

  const handlePrint = () => window.print();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Invoice Bill</h2>
        <button
          onClick={handlePrint}
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
            <p>{invoiceData.name || 'Customer Name'}</p>
            <p className="text-sm text-gray-600">{invoiceData.address || 'Customer Address'}</p>
          </div>
          <div className="text-right">
            <p><strong>Invoice No:</strong> {invoiceData?.invoiceNumber || '--'}</p>
            <p><strong>Date:</strong> {invoiceData?.date || '--'}</p>
            <p><strong>Customer Name:</strong> {invoiceData?.name || '--'}</p>
            <p><strong>Mobile No:</strong> {invoiceData?.mobileNumber || '--'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-gray-300 rounded-md overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Qty</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Original Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Offer Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm">{item.product || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right">₹ {parseFloat(item.originalPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">₹ {parseFloat(item.offerPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-right">₹ {(parseFloat(item.offerPrice || 0) * parseInt(item.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 text-right">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹ {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>₹ {calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹ {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <span>₹ {parseFloat(invoiceData.paidAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-red-600">
            <span>Due:</span>
            <span>₹ {calculateDue().toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mt-6 text-blue-600">
          <p>Thank you for choosing Vision Care Optics!</p>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;
