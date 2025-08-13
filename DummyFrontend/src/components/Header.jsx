import React from 'react';
import { Eye } from 'lucide-react';

const Header = () => (
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
);

export default Header;
