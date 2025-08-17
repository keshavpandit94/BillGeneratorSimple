import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (tab) => location.pathname === tab;

  return (
    <div className="bg-white border-b border-gray-200 px-10 py-4 flex justify-between items-center">
      <div className="flex space-x-0 gap-4">
        <button
          onClick={() => navigate('/generate')}
          className={`px-6 py-3 font-medium text-sm ${isActive('/generate') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Generate Bill
        </button>
        <button
          onClick={() => navigate('/database')}
          className={`px-6 py-3 font-medium text-sm ${isActive('/database') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Bill History
        </button>

        <button
          onClick={() => navigate('/products')}
          className={`px-6 py-3 font-medium text-sm ${isActive('/products') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Product List
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
