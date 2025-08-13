import { Download, Edit3, Eye, FileSpreadsheet, Printer, Search, Trash2, Upload } from 'lucide-react';
import React from 'react';

const CustomerDatabase = ({ customers, onEdit, onDelete, searchTerm, setSearchTerm, onPreview, onExcelDownload }) => {



  return (

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
              {/* <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Template
              </button>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
              </button> */}
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 flex items-center"
              onClick={onExcelDownload}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Excel Integration Instructions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              {/* <li>• <strong className="text-yellow-800">Download Template:</strong> Get the Excel template with correct column headers</li> */}
              {/* <li>• <strong className="text-yellow-800">Import Excel:</strong> Upload your Excel file to load customer data</li> */}
              <li>• <strong className="text-yellow-800">Export Excel:</strong> Download current database as Excel file</li>
              <li>• <strong className="text-yellow-800">Required Columns:</strong> Invoice Number, Customer Name, Mobile Number, Booking Date, Delivery Date, Total, Amount Paid, Amount Due</li>
            </ul>
          </div>
        </div>
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
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {customer.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.name}
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
                      ₹ {customer.grandPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹ {customer.paidAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={customer.duesAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹ {customer.duesAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        {/* <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button> */}
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                          onClick={() => onEdit(customer.invoiceNumber)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Print"
                          onClick={() => onPreview(customer.invoiceNumber)}
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          onClick={() => onDelete(customer.invoiceNumber)}
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

  );
};

export default CustomerDatabase;

// <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//   <h2 className="text-xl font-semibold mb-4">Customer Records</h2>
//   {customers.length === 0 ? (
//     <p className="text-gray-500">No customers found.</p>
//   ) : (
//     <table className="w-full border text-sm">
//       <thead>
//         <tr className="bg-gray-200">
//           <th className="border px-2 py-1">Invoice</th>
//           <th className="border px-2 py-1">Date</th>
//           <th className="border px-2 py-1">Name</th>
//           <th className="border px-2 py-1">Mobile</th>
//           <th className="border px-2 py-1">Bookin date</th>
//           <th className="border px-2 py-1">Delivery Date</th>
//           <th className="border px-2 py-1">Total</th>
//           <th className="border px-2 py-1">Paid Amount</th>
//           <th className="border px-2 py-1">Dues Amount</th>
//           <th className="border px-2 py-1">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {customers.map((cust, index) => (
//           <tr key={index}>
//             <td className="border px-2 py-1">{cust.invoiceNumber}</td>
//             <td className="border px-2 py-1">{cust.date}</td>
//             <td className="border px-2 py-1">{cust.name}</td>
//             <td className="border px-2 py-1">{cust.mobileNumber}</td>
//             <td className="border px-2 py-1">{cust.bookingDate}</td>
//             <td className="border px-2 py-1">{cust.deliveryDate}</td>
//             <td className="border px-2 py-1">{cust.grandPrice}</td>
//             <td className="border px-2 py-1">{cust.paidAmount}</td>
//             <td className="border px-2 py-1">{cust.duesAmount}</td>
//             <td className="border px-2 py-1">
//               <button onClick={() => onEdit(cust)} className="text-blue-600 mr-2">Edit</button>
//               <button onClick={() => onDelete(cust._id)} className="text-red-600">Delete</button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )}
// </div>