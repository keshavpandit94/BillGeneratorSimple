import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Save, ArrowLeft } from "lucide-react"; // ✅ Import icons

const ProductForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    originalPrice: "",
    offerPrice: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          Product Form
        </h2>
        <Link
          to="/products"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Enter product name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Price (₹)</label>
        <input
          type="number"
          name="originalPrice"
          value={form.originalPrice}
          onChange={handleChange}
          required
          placeholder="Enter price"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Offer Price */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Offer Price (₹)</label>
        <input
          type="number"
          name="offerPrice"
          value={form.offerPrice}
          onChange={handleChange}
          placeholder="Enter discounted price"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
      >
        <Save className="w-5 h-5" />
        Save Product
      </button>
    </form>
  );
};

export default ProductForm;
