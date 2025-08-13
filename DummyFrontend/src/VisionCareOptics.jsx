import React, { useState, useEffect } from 'react';
import { Eye, Search, Download, Upload, FileSpreadsheet, Printer, Plus, Minus, X, Edit3, Trash2 } from 'lucide-react';

const VisionCareOptics = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: '',
    customerName: '',
    customerAddress: '',
    mobileNumber: '',
    bookingDate: '',
    deliveryDate: '',
    items: [{ product: '', quantity: 1, price: 0 }],
    amountPaid: 0
  });

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Sample products - replace with actual product list
  const products = [
    { id: 1, name: 'Single Vision Lens', price: 1500 },
    { id: 2, name: 'Progressive Lens', price: 3500 },
    { id: 3, name: 'Blue Light Blocking Lens', price: 2000 },
    { id: 4, name: 'Anti-Glare Coating', price: 800 },
    { id: 5, name: 'Photochromic Lens', price: 2800 },
    { id: 6, name: 'Frame - Designer', price: 4500 },
    { id: 7, name: 'Frame - Regular', price: 1800 },
    { id: 8, name: 'Contact Lenses (Monthly)', price: 1200 }
  ];

  // Sample customer data
  useEffect(() => {
    const sampleCustomers = [
      {
        invoiceNumber: 'INV2508223',
        customerName: 'John Smith',
        mobileNumber: '9876543210',
        bookingDate: '2025-08-01',
        deliveryDate: '2025-08-08',
        total: 5300,
        paid: 5300,
        due: 0
      },
      {
        invoiceNumber: 'INV2508224',
        customerName: 'Sarah Johnson',
        mobileNumber: '9123456789',
        bookingDate: '2025-07-30',
        deliveryDate: '2025-08-06',
        total: 7200,
        paid: 5000,
        due: 2200
      },
      {
        invoiceNumber: 'INV2508225',
        customerName: 'Mike Wilson',
        mobileNumber: '9555666777',
        bookingDate: '2025-07-28',
        deliveryDate: '2025-08-04',
        total: 3800,
        paid: 3800,
        due: 0
      }
    ];
    setCustomers(sampleCustomers);

    // Set today's date and generate invoice number
    const today = new Date().toISOString().split('T')[0];
    const invoiceNum = `INV${Date.now().toString().slice(-7)}`;
    setFormData(prev => ({
      ...prev,
      date: today,
      bookingDate: today,
      invoiceNumber: invoiceNum
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          
          // If product is selected, update the price
          if (field === 'product') {
            const selectedProduct = products.find(p => p.name === value);
            updatedItem.price = selectedProduct ? selectedProduct.price : 0;
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return sum + (itemPrice * itemQuantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.10; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateDue = () => {
    return Math.max(0, calculateTotal() - (parseFloat(formData.amountPaid) || 0));
  };

  const handleSaveBill = () => {
    const newCustomer = {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      mobileNumber: formData.mobileNumber,
      bookingDate: formData.bookingDate,
      deliveryDate: formData.deliveryDate,
      total: calculateTotal(),
      paid: parseFloat(formData.amountPaid) || 0,
      due: calculateDue()
    };

    setCustomers(prev => [newCustomer, ...prev]);
    
    // Reset form
    const today = new Date().toISOString().split('T')[0];
    const invoiceNum = `INV${Date.now().toString().slice(-7)}`;
    setFormData({
      invoiceNumber: invoiceNum,
      date: today,
      customerName: '',
      customerAddress: '',
      mobileNumber: '',
      bookingDate: today,
      deliveryDate: '',
      items: [{ product: '', quantity: 1, price: 0 }],
      amountPaid: 0
    });

    alert('Bill saved successfully!');
  };

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    const invoiceNum = `INV${Date.now().toString().slice(-7)}`;
    setFormData({
      invoiceNumber: invoiceNum,
      date: today,
      customerName: '',
      customerAddress: '',
      mobileNumber: '',
      bookingDate: today,
      deliveryDate: '',
      items: [{ product: '', quantity: 1, price: 0 }],
      amountPaid: 0
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobileNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vision Care Optics</h1>
              <p className="text-sm text-gray-600">123 Optical Street, City Center, State 12345</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>+1 (555) 123-4567</p>
            <p>info@visioncareoptics.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-0">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'generate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Generate Bill
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Customer Database
          </button>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bill Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Bill Details</h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Invoice Number and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address</label>
                  <textarea
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Booking and Delivery Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Items</label>
                    <button
                      onClick={addItem}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <select
                          value={item.product}
                          onChange={(e) => updateItem(index, 'product', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.name}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                        
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          min="1"
                          className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', e.target.value)}
                          className="w-24 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        
                        {formData.items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
                  <input
                    type="number"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveBill}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save Bill
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Bill Preview</h2>
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
                    <p>{formData.customerName || 'Customer Name'}</p>
                    <p className="text-sm text-gray-600">{formData.customerAddress || 'Customer Address'}</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Invoice #:</strong> {formData.invoiceNumber}</p>
                    <p><strong>Date:</strong> {formData.date ? new Date(formData.date).toLocaleDateString() : ''}</p>
                    <p><strong>Booking:</strong> {formData.bookingDate ? new Date(formData.bookingDate).toLocaleDateString() : ''}</p>
                    <p><strong>Delivery:</strong> {formData.deliveryDate ? new Date(formData.deliveryDate).toLocaleDateString() : ''}</p>
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
                      {formData.items.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-sm">{item.product || '-'}</td>
                          <td className="px-4 py-2 text-sm text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-right">₹ {parseFloat(item.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-right">₹ {(parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}</td>
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
                    <span>₹ {parseFloat(formData.amountPaid || 0).toFixed(2)}</span>
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
          </div>
        </div>
      )}

      {activeTab === 'database' && (
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Database Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Customer Database</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Template
                  </button>
                  <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Excel
                  </button>
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 flex items-center">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">Excel Integration Instructions:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong className="text-yellow-800">Download Template:</strong> Get the Excel template with correct column headers</li>
                  <li>• <strong className="text-yellow-800">Import Excel:</strong> Upload your Excel file to load customer data</li>
                  <li>• <strong className="text-yellow-800">Export Excel:</strong> Download current database as Excel file</li>
                  <li>• <strong className="text-yellow-800">Required Columns:</strong> Invoice Number, Customer Name, Mobile Number, Booking Date, Delivery Date, Total, Amount Paid, Amount Due</li>
                </ul>
              </div>
            </div>

            {/* Database Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {customer.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.mobileNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(customer.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(customer.deliveryDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹ {customer.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹ {customer.paid.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={customer.due > 0 ? 'text-red-600' : 'text-green-600'}>
                            ₹ {customer.due.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-3">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900"
                              title="Print"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionCareOptics;